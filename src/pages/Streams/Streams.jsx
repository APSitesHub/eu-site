import axios from 'axios';
import { StreamsBackgroundWrapper } from 'components/BackgroundWrapper/BackgroundWrappers';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { LoaderWrapper } from 'components/SharedLayout/Loaders/Loader.styled';
import { LoginErrorNote } from 'components/Stream/MiscStyles.styled';
import { Formik } from 'formik';
import { nanoid } from 'nanoid';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import {
  LoginFormText,
  LoginLogo,
  StreamAuthTextHello,
} from '../../components/Stream/Stream.styled';
import logo from '../../img/svg/logoNew.png';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  LoginForm,
} from './AdminPanel/AdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const Streams = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const location = useLocation();

  const wakeupRequest = async () => {
    try {
      const wake = await axios.get('/');
      console.log(wake.data);
    } catch (error) {
      console.log(error);
    }
  };

  const detectUser = () => {
    const id = localStorage.getItem('userID');
    const name = localStorage.getItem('userName');
    if (!id || !name) {
      setIsUserLogged(isLogged => (isLogged = false));
      return;
    }
    setCurrentUser(
      currentUser =>
        (currentUser = {
          username: name,
          userID: id,
          userIP: '-',
        })
    );
    setIsUserLogged(isLogged => (isLogged = true));
  };

  const initialLoginValues = {
    name: '',
  };

  const loginSchema = yup.object().shape({
    name: yup.string().required('Enter your name!'),
  });

  const handleLoginSubmit = (values, { resetForm }) => {
    values.name = values.name.trim().trimStart();

    setIsUserLogged(isLogged => (isLogged = true));
    localStorage.setItem('userID', nanoid(8));
    localStorage.setItem('userName', values.name);
    setCurrentUser(
      currentUser =>
        (currentUser = {
          username: values.name,
          userID: localStorage.getItem('userID'),
        })
    );
    setIsUserInfoIncorrect(false);
    resetForm();
  };

  useLayoutEffect(() => {
    wakeupRequest();

    const getLinksRequest = async () => {
      try {
        setIsLoading(isLoading => (isLoading = true));
        setLinks((await axios.get('/unilinks')).data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(isLoading => (isLoading = false));
      }
    };
    getLinksRequest();
  }, []);

  useEffect(() => {
    detectUser();
  }, [isLoading]);

  return (
    <>
      <StreamsBackgroundWrapper>
        {!isUserLogged && !location.pathname.includes('-chat') ? (
          <Formik
            initialValues={initialLoginValues}
            onSubmit={handleLoginSubmit}
            validationSchema={loginSchema}
          >
            <LoginForm>
              <LoginLogo src={logo} alt="EU logo" />
              <LoginFormText>
                <StreamAuthTextHello>Hello!</StreamAuthTextHello>
                Our website is not available without authorization. Please enter
                your name.
              </LoginFormText>
              <Label>
                <AdminInput
                  type="text"
                  name="name"
                  placeholder="Your name"
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="name" type="text" />
              </Label>
              <AdminFormBtn type="submit">
                <FormBtnText>Log In</FormBtnText>
              </AdminFormBtn>
              <LoginErrorNote
                style={
                  isUserInfoIncorrect ? { opacity: '1' } : { opacity: '0' }
                }
              >
                Password or email is incorrect!
              </LoginErrorNote>
            </LoginForm>
          </Formik>
        ) : (
          <Outlet context={[links, isLoading, currentUser]} />
        )}

        {isLoading && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
      </StreamsBackgroundWrapper>
    </>
  );
};

export default Streams;
