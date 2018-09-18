import Loadable from "react-loadable";
import Loading from "../Loading";

export default Loadable({
  loader: () => import("./Block"),
  loading: Loading
});
