import { addDoc, getDownloadURL, ref, storage, uploadString, collection, db } from "fbase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "components/NweetFactory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { DocumentData } from "firebase/firestore";

interface NweetFactoryProps {
  userObj: User
}

const NweetFactory = ({ userObj }: NweetFactoryProps) => {
  const [attachment, setAttachment] = useState<string>("");
  const [nweet, setNweet] = useState("");
  
  const nweetsRef = collection(db, "nweets");
  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nweet === "") {
      return ;
    }
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
  const onClearAttachment = () => setAttachment("");


  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.container}>
          <input 
            value={nweet}
            onChange={onChange}
            type="text" 
            placeholder="What's on your mind?" 
            maxLength={120} 
            className={styles.input}
          />
          <input type="submit" value="&rarr;" className={styles.arrow}/>
        </div>
        <label htmlFor="attach-file" className={styles.lable}>
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input 
          id="attach-file"
          type="file" 
          accept="image/*" 
          onChange={onFileChange}
          className={styles.attach}
        />
        {attachment && (
          <div className={styles.attachment}>
            <img 
              src={attachment} 
              alt="nweet attachment"
              style={{
                backgroundImage: attachment
              }}
            />
            <div onClick={onClearAttachment} className={styles.clear}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </>
  )
}

export default NweetFactory