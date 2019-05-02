

import React from "react";
import {FontIcon, RaisedButton} from "material-ui";
import {loginWithGoogle} from "../helpers/auth";
import {firebaseAuth} from "../config/constants";
import { ScaleLoader } from 'react-spinners';

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            splashScreen: false
        };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    handleGoogleLogin() {
        loginWithGoogle()
            .catch(function (error) {
                alert(error); // or show toast
                localStorage.removeItem(firebaseAuthKey);
            });
        localStorage.setItem(firebaseAuthKey, "1");
    }

    componentWillMount() {
                firebaseAuth().getRedirectResult().then(function(result) {
         if (result.user) {
         console.log("GoogleLogin Redirect result");
         if (result.credential) {
         // This gives you a Google Access Token. You can use it to access the Google API.
         let token = result.credential.accessToken;
         // ...
         }
         // The signed-in user info.
         let user = result.user;
         console.log("user:", JSON.stringify(user));
         }
         }).catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         // The email of the user's account used.
         var email = error.email;
         // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
         // ...
         alert(error);
         })
        ;

        /**
         * We have appToken relevant for our backend API
         */
        if (localStorage.getItem(appTokenKey)) {
            this.props.history.push("/app/home");
            return;
        }

        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                console.log("User signed in: ", JSON.stringify(user));

                localStorage.removeItem(firebaseAuthKey);

                // here you could authenticate with you web server to get the
                // application specific token so that you do not have to
                // authenticate with firebase every time a user logs in
                localStorage.setItem(appTokenKey, user.uid);

                // store the token
                this.props.history.push("/app/home")
            }
        });
    }

    render() {
        console.log(firebaseAuthKey + "=" + localStorage.getItem(firebaseAuthKey));
        if (localStorage.getItem(firebaseAuthKey) === "1")
          return <SplashScreen />;
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin}/>;
    }
}

const iconStyles = {

};

const backgroundImageFromFirebase = 'https://firebasestorage.googleapis.com/v0/b/instafilter-123.appspot.com/o/Sign%20In.png?alt=media&token=83e03a4a-5446-4b28-a203-1873b0d460eb';

const styles = {
  background: `url(${backgroundImageFromFirebase})`,
  height: '100vh',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}

const LoginPage = ({handleGoogleLogin}) => (
    <div style={styles}>

        <h1 className="login-h1">Dopple</h1>

        <div className="google-div">
            <RaisedButton className='google-login'
              style = {{height: '100px'}}
              label="Sign in with Google"
              labelColor={"#ffffff"}
              backgroundColor="#000"
              icon={<FontIcon className="fa fa-google" style={iconStyles}/>}
              onClick={handleGoogleLogin}
            />
        </div>
    </div>
);
const SplashScreen = () => (
  <div>
    <ScaleLoader
      css={'center'}
      height={'200'}
      width={'10'}
      color={'#000'}
      loading={true}
      />
</div>)
