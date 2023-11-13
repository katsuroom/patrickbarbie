import TitleBar from "./TitleBar";
import StatusBar from "./StatusBar";
import MapCardList from "./MapCardList";
import MapView from "./MapView";

export default function MainScreen()
{
    return(
        <div>
            <TitleBar />
            <div >
                <MapCardList />
                <MapView />
            </div>
            <StatusBar />
        </div>
    );
}