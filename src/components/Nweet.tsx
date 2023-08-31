import { db, deleteObject, ref, storage, DocumentData, doc, updateDoc, deleteDoc } from "fbase";
import { useState } from "react";
import styles from "components/Nweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

interface NweetProps {
  nweetObj: DocumentData,
  isOwner: boolean
}

const Nweet = ({ nweetObj, isOwner }: NweetProps) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState<string>(nweetObj.text);


  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      const docRef = doc(db, `nweets/${nweetObj.id}`);
      await deleteDoc(docRef);
      if (nweetObj.attachmentUrl) {
        const attachmentRef = ref(storage, nweetObj.attachmentUrl);
        await deleteObject(attachmentRef);
      }
    }
  };

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(nweetObj, newNweet);
    const docRef = doc(db, `nweets/${nweetObj.id}`);
    await updateDoc(docRef, {
      text: newNweet
    });
    setEditing(false);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value }} = event;
    setNewNweet(value);
  }

  return (
    <div className={styles.nweet}>
      {editing 
        ? 
        <>
          {isOwner && 
          <>
            <form onSubmit={onSubmit} className={`${styles.container} ${styles.edit}`}>
              <input 
              type="text"
              placeholder="Edit your nweet"
              value={newNweet} 
              onChange={onChange} 
              required 
              autoFocus
              className={styles.input}
              />
              <input type="submit" value="Update Nweet" className={styles.btn} />
            </form>
            <button onClick={toggleEditing} className={`${styles.btn} ${styles.cancel}`}>
              Cancel
            </button>
          </>}
        </>
        : 
        <>
        <h4>{nweetObj.text}</h4>
        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="attachment" />}
        {isOwner && 
          <div className={styles.actions}>
            <span onClick={onDeleteClick}>
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <span onClick={toggleEditing}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
          </div>
        }
        </>
      }
    </div>
  )
}

export default Nweet;