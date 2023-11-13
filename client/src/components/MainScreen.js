import TitleBar from "./TitleBar";
import StatusBar from "./StatusBar";
import MapCardList from "./MapCardList";

export default function MainScreen()
{
    return(
        <div>
            <TitleBar />
            <div >
                <MapCardList />
            </div>
            <StatusBar />
        </div>
    );
}