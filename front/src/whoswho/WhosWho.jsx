import React from 'react';
import { Link } from 'react-router-dom';

class WhosWho extends React.Component {
  constructor(props) {
    super(props);

    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
    this.apiToken = process.env.REACT_APP_API_TOKEN || 'dummy';

    this.elementsByPage = 12;

    this.state = {
      currentPage: 0,
      characters: [],
    };
  }

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate() {
    this.loadPage();
  }

  loadPage() {
    // get page of items from api
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    const offset = page * this.elementsByPage;
    const limit = this.elementsByPage;
    if (page !== this.state.currentPage) {
      fetch(`${this.apiUrl}/characters?token=${this.apiToken}&offset=${offset}&limit=${limit}`,
        { method: 'GET' })
        .then(response => response.json())
        .then(characters => {
          this.setState({ currentPage: page, characters });
        });
    }
  }

  render() {
    const { characters, currentPage } = this.state;

    return (<div className="container">
      <h1 className="display-1 text-center"> Marvel Characters </h1>
      <div className="row">
        {characters.map((character, idx) =>
          <div key={idx} className="card-group col-lg-2 col-xs-4 col-sm-4">
            <div className="card">
              <img src={character.picture} className="card-img-top" alt="character">
              </img>
              <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
              </div>
            </div>
          </div>)
        }
      </div>
      <ul className="pagination">
        <li className={`page-item previous-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link to={{ search: `?page=${currentPage - 1}` }} className="page-link">Previous</Link>
        </li>
        <li className={`page-item next-item `}>
          <Link to={{ search: `?page=${currentPage + 1}` }} className="page-link">Next</Link>
        </li>
      </ul>
    </div>);

  }
}

export { WhosWho };
