import { useContext } from "react";
import ErrorsLogs from "../store/ErrorsLogs";
import { ContextErrorsLogs } from "../store/contexts";


const useErrorsLogsContext = () => {
    return useContext(ContextErrorsLogs) as ErrorsLogs;
};

export default useErrorsLogsContext;