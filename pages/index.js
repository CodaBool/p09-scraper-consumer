import { useState, useEffect } from 'react'
import FadeIn from 'react-fade-in'
import Toast from '../components/Toast'
import { LIST_OF_ENDPOINTS, BASE_API_ENDPOINT } from '../constants'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Envelope, Key, ArrowReturnRight, ArrowLeft, PlayFill } from 'react-bootstrap-icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
// https://www.npmjs.com/package/react-fade-in
import axios from 'axios'
import trendingGithub from '../data/trending-github.json'
import trendingMovies from '../data/trending-movies.json'
import trendingNPM1 from '../data/trending-npm-1.json'
import trendingNPM2 from '../data/trending-npm-2.json'
import trendingTV from '../data/trending-tv.json'
import upcomingMovies from '../data/upcoming-movies.json'
import router from 'next/router'

export default function Home() {
  const [error, setError] = useState(null)
  const [endpoint, setEndpoint] = useState()
  const [data, setData] = useState()

  const markdown = `
async function getGithubTrending() {
  const res = await fetch(\`
${BASE_API_ENDPOINT}${endpoint}\`)
    .then(res => res.json())
    .then(res => res)
  const container = document.querySelector('.container')
  container.innerHTML = JSON.stringify(res, null, 2)
}
`

  useEffect(() => {
    if (data) {
      setData(null)
    }
  }, [endpoint])

  function getDummyData() {
    switch(endpoint) {
      case 'trending-github': setData(trendingGithub); break
      case 'trending-movies': setData(trendingMovies); break
      case 'trending-npm-1': setData(trendingNPM1); break
      case 'trending-npm-2': setData(trendingNPM2); break
      case 'trending-tv': setData(trendingTV); break
      case 'upcoming-movies': setData(upcomingMovies); break
      default: return null
    }
  }

  return (
    <FadeIn>
      <h1 className="my-4 display-3">Welcome, </h1>
      <h5 className="">This is a simple page to interact with a lambda which scrapes websites and outputs the relevant data.</h5>
      <Col>
        <Card className="my-5 shadow p-4 rounded"
          style={{
            margin: 'auto'
          }}
        >
          {!endpoint && 
            <>
              <h1 className="display-4 text-center">Select an Endpoint to begin</h1>
              <div style={{flexDirection: 'row', flexWrap: 'wrap'}} className="d-flex">
                {LIST_OF_ENDPOINTS.map(path => (
                  <Card key={path} onClick={() => setEndpoint(path)} className="rounded shadow m-5 p-5 hover-card">
                    {path.split('-').join(' ')}
                  </Card>
                ))}
              </div>
            </>
          }
          {endpoint && 
            <>
              <div className="d-block">
                <Button variant="light" className="rounded-circle mb-5 border me-4 mt-4" onClick={() => setEndpoint(null)} style={{width: '3rem', height: '3rem'}}>
                  <ArrowLeft className="mb-1" size={18} /> 
                </Button>
                <h1 className="d-inline display-4 pb-4">{endpoint.split('-').join(' ')}</h1>
                <Button className="ms-5 mb-3" variant="success" onClick={getDummyData}>
                  Send Request <PlayFill className="ml-2" size={20} />
                </Button>
                <div className="d-flex" style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
                  <SyntaxHighlighter language="javascript" style={dracula}>
                    {markdown}
                  </SyntaxHighlighter>
                  <div className="mx-2"></div>
                  {data && 
                    <FadeIn>
                      <SyntaxHighlighter language="javascript" style={dracula}>
                        {JSON.stringify(data, null, 2)}
                      </SyntaxHighlighter>
                    </FadeIn>
                  }
                </div>
              </div>
              
            </>
          }
        </Card>
      </Col>
      <Row>
        <Button
          className="mx-auto mb-5"
          variant="light"
          style={{width: '10em'}}
          href="https://github.com/CodaBool/p09-web-scraper"
        >
          See Code <ArrowReturnRight className="ml-2" size={18} />
        </Button>
      </Row>
      <div className="toastHolder" style={{position: 'fixed', top: '10%', right: '10%'}}>
        <Toast show={!!error} setShow={setError} title='Could not Sign you in' body={<p className="text-danger"><strong>{error}</strong></p>} error />
      </div>
    </FadeIn>
  )
}
