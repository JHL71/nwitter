import { useEffect, useState } from "react";
import { db, collection, onSnapshot, fbAuth } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import styles from "routes/Home.module.css";
import { DocumentData } from "firebase/firestore";

interface HomeProps {
  userObj: User,
}

interface DocData {
  creatorId: string,
  text: string,
  attachmentUrl: string,
  createdAt: number
}

const Home = ({ userObj }: HomeProps) => {
  const [nweets, setNweets] = useState<DocumentData[]>([]);
  
  const nweetsRef = collection(db, "nweets");

  useEffect(() => {
    const unsub = onSnapshot(nweetsRef, (snapshot) => {
        const newNweets = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data() as DocData,
          }
        }).sort((a, b) => b.createdAt - a.createdAt);
        setNweets(newNweets);
      });
    fbAuth.onAuthStateChanged(fbAuth.getAuth(), (user) => {
      if (user === null) {
        unsub();
      }
    })
  }, [nweetsRef])

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <NweetFactory userObj={userObj} />
        <div className={styles.nweets}>
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
    </div>
  )
}
export default Home;