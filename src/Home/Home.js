import { useEffect } from "react";
import { useLoading } from "../Context/LoadingContext/LoadingContextProvider";
import { usePermissionsCollection } from "../Context/PermissionsContext/PermissionsContextProvider";
import { useRolesCollection } from "../Context/RolesContext/RolesContextProvider";
import Loading from "../shared/components/Loading/Loading";
import EmptyView from "./EmptyView/EmptyView";
import ExpandingTable from "./ExpandingTable/ExpandingTable";

const Home = () => {
    const { state: permissionsCollectionState } = usePermissionsCollection();
    const {
        state: rolesState,
    } = useRolesCollection();

    const { loading, setLoading } = useLoading();
  
    useEffect(() => {
        setLoading(false);
    }, [permissionsCollectionState.viewPermissionsCollection])

    return (
        <>
            {!loading ?
                <section>
                    {permissionsCollectionState.viewPermissionsCollection.length > 0 && rolesState.visibleRolesCollection.length > 0 ?
                        <ExpandingTable />
                        :
                        <EmptyView />
                    }
                </section>
            :
            <Loading />
            }
        </>
    )
}

export default Home;
