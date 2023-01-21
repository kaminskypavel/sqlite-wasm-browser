import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import {useState} from 'react'
import Highlighter from '../components/Highlighter'
import useBinaryFile from '../services/usebinaryFile'
import {useDB, useDBQuery} from '../services/useDB'

export default function Home() {

  const data = useBinaryFile("/chinook.db")
  const db = useDB(data);
  const [query, setQuery] = useState("SELECT * FROM albums t LIMIT 10")
  const [results, setResults] = useState<object>({})
  const tablesQuery = "SELECT name FROM  sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
  const tablesQueryResults = useDBQuery(db, tablesQuery)
  const tables = tablesQueryResults?.[0]?.values?.map((v) => v[0])


  const runQuery = () => {
    if (db) {
      try {
        setResults(db.exec(query))
      }
      catch (e) {
        if (e instanceof Error)
          setResults([{error: e.message}])
      }

    }
  }

  return (
    <>
      <Head>
        <title>sqlite-wasm-browser</title>
        <meta name="description" content="sqlite-wasm-browser" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <Script type="module" src="/sql-loader.js" />

      <main className={styles.main}>
        <div className='w-full grid grid-cols-2'>
          <h3 className='text-sm font-bold '><Link className="text-blue-500" href="https://github.com/kaminskypavel/sqlite-wasm-browser">⭐ on Github</Link></h3>

          <h3 className='text-sm font-bold text-right'>download database file form <Link className="text-blue-500" href="/chinook.db">here</Link></h3>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={10}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={10}
              priority
            />
          </div>
        </div>


        <div className='w-full grid grid-cols-10 m-10'>
          <div className='col-span-1'>
            <div className="text-left">
              <h1 className="text-2xl font-bold underline">
                {tables?.length} Tables
              </h1>
              <ul>
                {tables?.map((t) => <li key={t?.toString()}>{t}</li>)}
              </ul>
            </div>
          </div>
          <div className='col-span-9'>
            <div className='mx-10'>

              <textarea className="w-full h-32 rounded-xl  p-2 text-lg" value={query} onChange={
                (e) => setQuery(e.target.value)
              } />
              <button className="rounded-lg flex flex-row bg-purple-500 p-2" onClick={runQuery}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                <p>execute</p>
              </button>

              <div className='mt-10'>

                <Highlighter content={JSON.stringify(results ?? {}, null, 4)} language="json" />
              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  )
}
