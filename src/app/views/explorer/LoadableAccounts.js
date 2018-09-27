import Loadable from "react-loadable";
import Loading from "../Loading";

export default Loadable({
  loader: () => import("./Accounts"),
  loading: Loading
});
