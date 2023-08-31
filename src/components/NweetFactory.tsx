import { addDoc, getDownloadURL, ref, storage, uploadString, DocumentData, collection, db } from "fbase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface NweetFactoryProps {
  userObj: User
}

const NweetFactory = ({ userObj }: NweetFactoryProps) => {
  const [attachment, setAttachment] = useState<string>("");
  const [nweet, setNweet] = useState("");
  
  const nweetsRef = collection(db, "nweets");
  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      await uploadString(attachmentRef, attachment as string, 'data_url');
      attachmentUrl  = await getDownloadURL(attachmentRef);
    }
    const nweetObj: DocumentData = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid, 
      attachmentUrl
    }
    
    await addDoc(nweetsRef, nweetObj);
    setNweet("");
    setAttachment("");
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target : { value } } = event;
    setNweet(value);
  }
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { files } } = event;
    if (files) {
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        if (finishedEvent.target) {
          const { target: { result } } = finishedEvent;
          setAttachment(result as string);
        }
      }
      if (theFile) {
        reader.readAsDataURL(theFile);
      }
    }
  }
  const onClearAttachment = () => {
    setAttachment("");
  }


  return (
    <>
      <form onSubmit={onSubmit}>
        <input 
          value={nweet}
          onChange={onChange}
          type="text" 
          placeholder="What's on your mind?" 
          maxLength={120} 
        />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Nweet" />
        {attachment && (
          <>
            <img src={attachment} alt="nweet attachment" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </form>
    </>
  )
}

export default NweetFactory