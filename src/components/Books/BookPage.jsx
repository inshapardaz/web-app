import React from 'react';
import {Link} from 'react-router-dom';
import Page from '../Layout/Page.jsx';
import { getBook, getChapters } from '../../utils/fetchApi';
import Image from '../Image.jsx';
import { Button, Tag, List } from 'antd';


class BookPage extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingChapters: false,
      book: { categories: []},
      chapters: { items: []}
    }
  }

  componentWillMount() {
    const {
      match: { params },
    } = this.props

    this.loadBook(params.id);
    this.loadChapters(params.id);
  }

  componentWillReceiveProps(nextProps){
    const {
      match: { params },
    } = nextProps
    this.loadBook(params.id);
    this.loadChapters(params.id);
  }

  loadBook(id) {
    this.setState({
      isLoading: true
    });

    getBook(id)
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            book: result
          });
        },
        () => {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      )

    this.setState({
      isLoading: false
    });
  }

  loadChapters(id) {
    this.setState({
      isLoadingChapters: true
    });

    getChapters(id)
      .then(
        (result) => {
          this.setState({
            isLoadingChapters: false,
            chapters: result
          });
        },
        () => {
          this.setState({
            isLoadingChapters: false,
            isError: true
          });
        }
      )

    this.setState({
      isLoadingChapters: false
    });
  }

  render() {

    if (!this.state) {
      return null;
    }

    const { isLoading, isError, book, isLoadingChapters, chapters } = this.state;

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (isError) {
      return <div>Error loading book. Please retry.</div>
    }

    console.log(chapters);

    return (
      <Page>
        <div className="profile">
          <div className="row">
            <div className="col-xl-4">
              <div className="card profile__header" style={{ backgroundImage: 'url(/resources/images/bkg_3.jpeg)' }}>
                <div className="profile__header-card">
                  <div className="card-body text-center">
                    <Image source={book} height="110px" width="110px" />
                    <br />
                    <br />
                    <Button.Group size="default">
                      <Button style={{ width: 150 }}>Add to Favorite</Button>
                      <Button style={{ width: 150 }}>Read</Button>
                    </Button.Group>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>Details</strong>
                  </h5>
                  <dl className="row">
                    <dt className="col-xl-3">Author:</dt>
                    <dd className="col-xl-9">{book.authorName}</dd>
                    <dt className="col-xl-3">Details:</dt>
                    <dd className="col-xl-9">{book.description}</dd>
                    <dt className="col-xl-3">Categories:</dt>
                    <dd className="col-xl-9">
                      {book.categories.map(t =>
                        <Tag key={t.id} closable={false}>{t.name}</Tag>
                      )}
                    </dd>
                    <dt className="col-xl-3">Access:</dt>
                    <dd className="col-xl-9">
                      <Tag closable={false}>
                        {book.isPublic ? "Public" : "Private"}
                      </Tag>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
                  <List
                    size="large"
                    header={<h3>Chapters</h3>}
                    bordered
                    loading={isLoadingChapters}
                    dataSource={chapters.items}
                    renderItem={chapter => (
                      <List.Item>
                        <Link to={`/books/${book.id}/chapters/${chapter.id}`}>
                          {chapter.chapterNumber}. {chapter.title}
                        </Link>
                      </List.Item>)
                    }
                  />
            </div>
          </div>
        </div>
      </Page>);
  }
}

export default BookPage;
