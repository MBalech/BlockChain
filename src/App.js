import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route,useParams } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/cjs/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


//Modifie un article
const ModifyArticle = () => {
  let { id } = useParams();
  const [editor, setEditor] = useState(null)
  const dispatch = useDispatch()
  //Appelle à la fonction qui enregistrera les dernières modifications
  const modifyArticle = () => dispatch(Ethereum.modifyArticle(id,(editor == null ? article : editor)))

  //Récupère les articles de l'état
  const allarticles = useSelector(({ allarticles }) => allarticles)
  const history = useSelector(({ historical }) => historical)
  var article = "";

  //Récupère l'article grâce à l'identifiant passé en paramètre
  for(var i = 0; i < allarticles.length; i++){
    if(allarticles[i].id === id) article = allarticles[i].article
  }

  //Permet de récupérer la dernière valeur du textarea avec le onChange
  const handleChange = (event) => {
    setEditor(event.target.value)
    article = editor
  }

  useEffect(() => {
  })

  return (
    <Container>
      <Row className="justify-content-center"><Col md="auto"><Home/></Col></Row>
      <Row className="justify-content-center"><Col md="auto">
      <form>
        <div className={styles.subTitle}>Modifier l'article</div>
        <div className={styles.mediumWrapper}>
          <textarea onChange={handleChange} defaultValue={article}/>
        </div>
        <input type="button" value="Submit" onClick={modifyArticle}/>
      </form>
      </Col></Row>
    </Container>
  )
}

//Ajout d'un nouvel article
const NewArticle = () => {
  const [editor, setEditor] = useState(null)
  const dispatch = useDispatch()
  const saveArticle = () => dispatch(Ethereum.saveArticle(editor))

  //Permet de récupérer la valeur dans le texterea en fonction des changements
  const handleChange = (event) => {
    setEditor(event.target.value)
  }
  useEffect(() => {
  })

  return (
    <Container>
      <Row className="justify-content-center"><Col md="auto"><Home/></Col></Row>
      <Row className="justify-content-center"><Col md="auto">
        <form>
        <div className={styles.subTitle}>New article</div>
        <div className={styles.mediumWrapper}>
          <textarea onChange={handleChange}/>
        </div>
        <input type="button" value="Submit" onClick={saveArticle}/>
      </form>
      </Col>
      </Row>
    </Container>
  )
}

//Liens
const Home = () => {
  return (
    <Row>
      <Col>
    <Nav className="justify-content-center">
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/article/new">Add an article</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/article/all">All articles</Nav.Link>
      </Nav.Item>
    </Nav>
      </Col>
    </Row>
  )
}

//Affiche un article
const Article = ({ id, article }) => {
  const linkEdit = "modifier/"+id;
  const linkHistory = "history/"+id;
  return (
    <Row className="justify-content-center" style={{padding : '1rem'}}>
      <Col md="auto">
      <Card style={{ width: '50rem' }}>
        <Card.Body>
          <Card.Title>Article number {id}</Card.Title>
          <Card.Text>
            {article}
          </Card.Text>
          <Card.Link href={linkEdit}>Edit</Card.Link>
          <Card.Link href={linkHistory}>Historical</Card.Link>
        </Card.Body>
      </Card>
      </Col>
    </Row>
  )
}
//Affiche un article
const ArticleHisto = ({id, article }) => {
  return (
    <Row  style={{padding : '1rem'}} className="justify-content-center">
      <Col md="auto">
        <Card style={{ width: '50rem' }}>
          <Card.Body>
            <Card.Title>Historical number {id}</Card.Title>
            <Card.Text>
              {article}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

//Affichage de tous les articles
const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const Lesarticles = useSelector(({ allarticles }) => allarticles)
  useEffect(() => {
    var tab = []
    for(var i = 0; i < Lesarticles.length; i++){
      tab.push(<Article key={Lesarticles[i].id} id ={Lesarticles[i].id} article={Lesarticles[i].article} />)
    }
    setArticles(tab)
  }, [setArticles, Lesarticles])

  return <Container>
    <Row className="justify-content-center"><Col md="auto"><Home/></Col></Row>
    {articles}
    </Container>
}

//Affichage de l'historique d'un article
const HistoryArticle = () => {
  let { id } = useParams();
  const [articles, setArticles] = useState([])
  const histoarticles = useSelector(({ historical }) => historical)
  useEffect(() => {
    var tab = []
    for(var i = 0; i < histoarticles.length; i++){
      if(histoarticles[i].id == id){
        for(var j = 0; j < histoarticles[i].articlesHisto.length; j++) {
          tab.push(<ArticleHisto key={histoarticles[i].id+"_"+j} id={j} article={histoarticles[i].articlesHisto[j]} />)
        }
      }
    }
    setArticles(tab)
  }, [setArticles, histoarticles])

  return <div><Home/>
    <div>{articles}</div></div>
}

const NotFound = () => {
  return <div>Not found</div>
}


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])
  return (
    <div>
      <div className={styles.title}>Welcome to Decentralized Wikipedia</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/article/all">
          <AllArticles />
        </Route>
        <Route path="/article/modifier/:id" children={<ModifyArticle />} />
        <Route path="/article/history/:id" children={<HistoryArticle />} />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
