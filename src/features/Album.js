import React from "react";
import {logout} from "../helpers/auth";
import {Grid, Row, Col, Image, Modal} from "react-bootstrap";
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase/app';
import { MoonLoader } from 'react-spinners';
import {Link} from 'react-router-dom';


const appTokenKey = "appToken"; // also duplicated in Login.js
export default class Album extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        allPhotos: [],
        showModal: false,
        currentPhoto: ''
      };

      firebase.auth().onAuthStateChanged(function(user) {
        // this.setState({ user: user });
        const firebaseAuthKey = "firebaseAuthInProgress";
        localStorage.removeItem(firebaseAuthKey);
      });

        this.handleLogout = this.handleLogout.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.getInitial = this.getInitial.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUploadStart = this.handleUploadStart.bind(this);
    }

    handleUploadStart(){
      window.scrollTo(0,0);
    }

    handleClose() {
      this.setState({
        showModal: false,
        currentPhoto: ''
      });
    }

    handleLogout() {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));

    }

    getInitial() {
      // let user = firebase.auth().currentUser;
      firebase.firestore().collection('photos').onSnapshot(res => {

        let allPhotos = [];
        res.forEach(doc => {
          var newItem = doc.data();
          newItem.id = doc.id;
          allPhotos.push(newItem);
        });

        this.setState({ allPhotos });


      })

    }

    handleRemove(id) {
      console.log('photo id', id)
      firebase.firestore().collection('photos').doc(id).delete()
      .then(res => {

        this.getInitial();

      })
      .catch(err => console.error(err))
    }

    componentDidMount() {
      this.getInitial();
    }

    handleUploadSuccess(filename) {

      // const db = firebase.firestore().settings({ timestampsInSnapshots: true });


      console.log('STARTED HANDLE')

      firebase.storage().ref('images').child(filename).getMetadata()
      .then( data => {

        console.log('META IS', data)

        firebase.storage().ref('images').child(filename).getDownloadURL()
        .then(url => {

          console.log('GOT THE IMAGE DETAILS', url)
          let user = firebase.auth().currentUser
// 1. create a photo object to save to the database
          let newPhoto = {
            url: url,
            userName: user.displayName,
            email: user.email,
            userId: user.uid,
            bucket: data.bucket,
            fullPath: data.fullPath,
            created: firebase.firestore.FieldValue.serverTimestamp()
          }

          console.log('new PHOTO IS', newPhoto)
// 2. save to the database
          firebase.firestore().collection('photos').add(newPhoto)
          .then(res => console.log(res))
          .catch(err => console.error(err));

        })
        .catch(err => console.error(err));
      })

    }



    render() {

        const allImages = this.state.allPhotos.map(photo => {

          if (photo.similarImages) {
            this.dopples = photo.similarImages.map(similarPhoto => {

              const styles = {
                backgroundImage: "url(" + similarPhoto.url + ")",
              }

              return (
                <Col
                  onClick={() => this.setState({ showModal: true, currentPhoto: similarPhoto.url })}
                  style={styles}
                  className="main-photo card-1"
                  key={similarPhoto.url}
                  xs={4} >
                </Col>

              );
            });
          } else {

            this.dopples =
              <div>
                <Col className="main-photo card-1" xs={4}>
                  <MoonLoader
                    color={'#000'}
                    loading={true}
                  />
                </Col>
                <Col className="main-photo card-1" xs={4}>
                  <MoonLoader
                    color={'#000'}
                    loading={true}
                  />
                </Col>
                <Col className="main-photo card-1" xs={4}>
                  <MoonLoader
                    color={'#000'}
                    loading={true}
                  />
                </Col>
                <Col className="main-photo card-1" xs={4}>
                  <MoonLoader
                    color={'#000'}
                    loading={true}
                  />
                </Col>
              </div>
          }


          return (
            <div key={photo.id}>
              <i onClick={() => this.handleRemove(photo.id)} className="bottom-icon material-icons main-close">close</i>
              <Image style={{ width: '100%' }} src={photo.url} responsive />

              <Grid className="testimonial-group">
                <Row className="text-center">
                  {this.dopples}
                </Row>
              </Grid>


              <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Google said you look like...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image style={{ width: '100%' }} src={this.state.currentPhoto} responsive />

                </Modal.Body>
                <Modal.Footer>
                  <div onClick={this.handleClose}>Close</div>
                </Modal.Footer>
              </Modal>



            </div>
          );
        })

        return (
            <div>
                <h1 style={{color: 'black', fontWeight: 'bold', fontSize: '5em', textAlign: 'center'}}>Doople Feed</h1>
                <h1 style={{color: 'black', fontWeight: 'bold', fontSize: '2em', textAlign: 'center'}}>This is where other users can see your dopples</h1>
                {allImages}

                <Grid className="bottom-nav">
                  <Row className="show-grid">
                    <Col xs={4} className="col-bottom">
                      <Link to="/app/home"><i className="bottom-icon material-icons">forward</i></Link>
                    </Col>
                    <Col xs={4} className="col-bottom">


                        <label>
                           <i className="bottom-icon material-icons">camera_alt</i>
                           <FileUploader
                             hidden
                             accept="image/*"
                             storageRef={firebase.storage().ref('images')}
                             onUploadStart={this.handleUploadStart}
                             onUploadError={this.handleUploadError}
                             onUploadSuccess={this.handleUploadSuccess}
                             onProgress={this.handleProgress}
                           />
                         </label>


                    </Col>
                    <Col xs={4} className="col-bottom" onClick={this.handleLogout}>
                      <i className="bottom-icon material-icons">assignment_return</i>
                    </Col>
                  </Row>
                </Grid>






            </div>
        );
    }
}
