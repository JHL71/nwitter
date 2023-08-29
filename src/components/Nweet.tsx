import { db, deleteObject, ref, storage, DocumentData, doc, updateDoc, deleteDoc } from "fbase";
import { useState } from "react";


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
      const attachmentRef = ref(storage, nweetObj.attachmentUrl);
      await deleteObject(attachmentRef);
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
    <div>
      {editing 
        ? 
        <>
          {isOwner && 
          <>
            <form onSubmit={onSubmit}>
              <input 
              type="text"
              placeholder="Edit your nweet"
              value={newNweet} 
              onChange={onChange} 
              required 
              />
              <input type="submit" value="Update Nweet" />
            </form>
            <button onClick={toggleEditing}>cancel</button>
          </>}
        </>
        : 
        <>
        <h4>{nweetObj.text}</h4>
        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" />}
        {isOwner && 
          <>
            <button onClick={onDeleteClick}>Delete Nweet</button>
            <button onClick={toggleEditing}>Edit Nweet</button>
          </>
        }
        </>
      }
    </div>
  )
}

export default Nweet;