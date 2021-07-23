import { mount } from "enzyme";
import { FunctionComponent } from "react";
import Auth from "../store/Auth";
import Chat from "../store/Chat";
import ErrorsLogs from "../store/ErrorsLogs";
import prepareWrappForPage from "./prepareWrappForPage";

const wrappAndMountPage = (Page: FunctionComponent, {authStore, chatStore, errorsLogsStore}: {authStore?: Auth, chatStore?: Chat, errorsLogsStore?: ErrorsLogs}) => {
    const wrappedComponent = prepareWrappForPage(Page, {authStore, chatStore, errorsLogsStore});
    return mount(wrappedComponent);
};

export default wrappAndMountPage;