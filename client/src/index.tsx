// import { useEffect } from 'react';
// import { FunctionComponent } from 'react';
// import { observer } from 'mobx-react-lite';

// import chat from '../store/chat';
// import auth from '../store/auth';
// import { ContextAuth, ContextChat } from '../store/contexts';

// import Rooms from '../components/Rooms';
// import PrivateRoom from '../components/PrivateRoom';
// import Button from '../components/styledComponents/Button';
// import Main from "../components/styledComponents/Main";
// import { ThemeProvider } from 'styled-components';
// import { theme } from '../constants/theme';

// const ChatPage: FunctionComponent = () => {
//     useEffect(() => {
//         try {
//             chat.connect(auth.id);
//         } catch (err) {
//             chat.registrError(String(err));
//         }
//     }, []);
//     const handleBack = () => {
//         chat.leave();
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <ContextAuth.Provider value={auth}>
//                 <ContextChat.Provider value={chat}>
//                     <Main>
//                     {chat.isPrivateRoom && (
//                         <>
//                             <Button
//                                 align={'flex-start'}
//                                 isNotCentrAlign={true}
//                                 onClick={handleBack}
//                             >
//                                 Назад
//                             </Button>
//                             <PrivateRoom />
//                         </>
//                     )}
//                     {!chat.isPrivateRoom && <Rooms />}
//                     </Main>
//                 </ContextChat.Provider>
//             </ContextAuth.Provider>
//         </ThemeProvider>
//     );
// };

// export default observer(ChatPage);
