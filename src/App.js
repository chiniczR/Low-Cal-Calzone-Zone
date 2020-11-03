import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Menu from './components/Menu/Menu';

function App() {
  return (
    <div className="App">
      <header className="App-header container-flex">
        <div className="row align-items-center">
          <h1 className="text-outline"><b>The Low-Cal Calzone Zone</b></h1> 
          {/* <img className="App-logo" src={calzone}></img> */}
        </div>
      </header>
      <Container fluid>
          <Row>
            <Col>
              <Menu />
            </Col>
            <Col>
            </Col>
            <Col>
            </Col>
          </Row>
        </Container>
    </div>
  );
}

export default App;
