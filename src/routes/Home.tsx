import Nweet from "components/Nweet";
import { db, fbAuth, fbfs } from "fbase";
import React, { useEffect, useState } from "react";

interface HomeProps {
  userObj: fbAuth.User | null
}

const nweetsRef = fbfs.collection(db, "nweets");

const Home = ({ userObj }: HomeProps) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState<fbfs.DocumentData[]>([]);
  useEffect(() => {
    fbfs.onSnapshot(nweetsRef, (snapshot) => {
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
    await fbfs.addDoc(nweetsRef, {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid, 
    });
    setNweet("");
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target : { value } } = event;
    setNweet(value);
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
        <input type="submit" value="Nweet" />
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