import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

export default function About() {
  return (
    <Container>
      <h1 className="display-1 my-3">About</h1>
      <Row>
        <Col md={6} className="aboutSummary p-3">
          <h5 className="display-4">Serverless Scraping ⛏️</h5>
          <p>
            &emsp;Have you ever run into websites which show something cool interesting and you would like to see more of it but don't want to actually bother to remember the page to go back. 
            This is what happened to me and the reasoning behind this project. Web Scraping is often used for places which do not offer proper programmatic solutions, like APIs or RSS feeds. 
            The way the technology works is a serverless Lambda function (which is just some code that runs on the cloud) will request the page just like any regular browser. 
            However, it then uses a module called <a href="https://www.npmjs.com/package/jsdom">jsdom</a> which will parse the data. At which point I can grab the exact parts I find interesting. 
            Then to finish up the function will connect to my Mongo database and save the good bits. 
            That is the basics of the function to collect the data, then there is another function (really the same function but a different if else branch) which gets the latest stored collection in the database. 
            This ends up looking a lot like a regular API, which is not by accident, the intention is to make the data from a website into a more programmatically consumable source. 
            Then at last to complete project, I wanted convenient way to see the data.
            There are a million ways you can do this, phone apps, websites, or desktop applications, really anything you can imagine. 
            
          </p>
          <ul>
            <dd className="d-inline">- React </dd><span className="text-muted"> (Front end)</span><br />
            <dd className="d-inline">- Socket.io </dd><span className="text-muted"> (Web Sockets)</span><br />
            <dd className="d-inline">- Express.js </dd><span className="text-muted"> (Back end)</span><br />
            <dd className="d-inline">- MongoDB </dd><span className="text-muted"> (Database)</span><br />
          </ul>
        </Col>
        <Col md={6}>
          <img src="/image/race.PNG" className="rounded shadow w-100 mb-3" />
        </Col>
        <Col md={6}>
          <div className="aboutTech">
            <img src="/image/simple.png" className="rounded w-100 mt-3" />
          </div>
        </Col>
        <Col md={6} className="aboutSummary p-3">
          <h5 className="display-4">How I ended up using it 🤖</h5>
          <p>
            &emsp;I was able to get data from several sites that I found interesting. 
            But now I had a different issue of how I would like to be viewing the data. 
            I ended up using another module <a href="https://www.npmjs.com/package/discord.js">discord.js</a> to connect my custom API to a desktop application called Discord. 
            This allowed me to type a command like !github and a bot would type an embed with all the scrapped data viewable in a table like format.
          </p>
          <Row>
            <p className="text-muted mx-auto" style={{fontSize: '1.1rem'}}>This website <a href="https://github.com/CodaBool/p09-scraper-consumer">repo</a></p>
            <p className="text-muted mx-auto" style={{fontSize: '1.1rem'}}>Lambda Scraper <a href="https://github.com/CodaBool/p09-web-scraper">repo</a></p>
            <p className="text-muted mx-auto" style={{fontSize: '1.1rem'}}>Discord Bot <a href="https://codabool.com">repo</a></p>
          </Row>
        </Col>
        <Col md={6} className="aboutSummary p-3">
          <h5 className="display-4">Issues I encountered 😤</h5>
          <p>
            &emsp;I built the technology entirely using the AWS platform and the entire DevOps solution is automated between Github Actions and the Serverless framework.
            I have had several projects using Serverless already and have come to like the framework. 
            However, I do run into plenty of issues. Serverless is a large community project and goes through versioning as well as forks. 
            I ran into issues with correctly setting up a API Gateway for my Lambda. I ran into issues with webpack since I first opted for ES6 code with conversion. 
            In the end I cut Webpack due to it being too much overhead and too tricky to configure. 
            <br /><br />
            &emsp;Then there was the AWS issue that I wanted to build the scraping technology also on lambda and triggerable through an endpoint.
            For endpoints like the trending-npm-1. I have multiple pages which are scraped and then compiled. The issue is not that the lambda timesout, it can run for up to 15 minutes as of 2021. The issue is that requests to API Gateway max out at 30 seconds. This means you should be responding within 30 seconds, which is reasonable. This did mean I needed to rewrite my application to comply with this timing, since some scrapes went on for nearly 50 seconds. Essentially I needed a lambda which would que another lambda and when that background lambda would finish it can have the first lambda send out a signal that it succeeded. This seemed too cumbersome and pointless. If all I was going to be getting was a '200 Ok, I'll tell a function to scrape'. I might as well have it be a crontab on a server and no api interface. This level of friction with the technology led me to compromise. I shortened every scrape function so it fit within the 30 second timeout. I do have the functions which scrape behind a password to prevent a monster bill. But the code is still viewable on <a href="https://github.com/CodaBool/p09-web-scraper">github</a>.
          </p>
        </Col>
        <Col md={6}>
          <img src="/image/race.PNG" className="rounded shadow w-100 mb-3" />
        </Col>
      </Row>
    </Container>
  )
}
