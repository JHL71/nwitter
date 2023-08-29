import React, { useEffect, useState } from "react";
import { v4 as uuidv4} from "uuid";
import { db, fbAuth, storage, ref, uploadString, getDownloadURL, DocumentData, collection, onSnapshot, addDoc } from "fbase";
import Nweet from "components/Nweet";

interface HomeProps {
  userObj: fbAuth.User
}

const nweetsRef = collection(db, "nweets");

const Home = ({ userObj }: HomeProps) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState<DocumentData[]>([]);
  const [attachment, setAttachment] = useState<string|null>();

  useEffect(() => {
    onSnapshot(nweetsRef, (snapshot) => {
      const newNweets = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
      setNweets(newNweets);
    })
  }, [])
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== null && attachment !== "") {
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
      reader.readAsDataURL(theFile);
    }
  }
  const onClearAttachment = () => {
    setAttachment(null);
  }

  return (
    <div>
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
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </form>
      <div>
        {nweets.map((nweet) => {
          return (
            <Nweet 
            key={nweet.id} 
            nweetObj={nweet} 
            isOwner={nweet.creatorId === userObj?.uid} 
            />
          )
        })}
      </div>
    </div>
  )
}
export default Home;