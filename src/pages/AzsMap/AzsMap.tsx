import Map from '../../components/Map/Map';
import ODINTSOVO_COORD from '../../const/map';
import { prepareMarkers } from '../../utils/markers';
import mapInfo from '../../mock/map-info';

// const center: LatLngExpression = [51.505, -0.09];
// const rectangle = [
//   [51.49, -0.08],
//   [51.5, -0.06],
// ];
function AzsMap() {
  const mapConfig = {
    center: ODINTSOVO_COORD,
    keyboard: true,
    dragging: true,
    attributionControl: false,
    zoomConfig: {
      zoom: 9,
      scrollWheelZoom: false,
    },
    style: { height: '100%' },
  };

  // const ai92FilteredMarkers = filterFeaturesByOption(mapInfo, "ai92");
  // const ai95FilteredMarkers = filterFeaturesByOption(mapInfo, "ai95");
  // const ai95pFilteredMarkers = filterFeaturesByOption(mapInfo, "ai95p");
  // const ai100pFilteredMarkers = filterFeaturesByOption(mapInfo, "ai100p");
  // const dtFilteredMarkers = filterFeaturesByOption(mapInfo, "dt");
  // const sugFilteredMarkers = filterFeaturesByOption(mapInfo, "sug");
  // const shopFilteredMarkers = filterFeaturesByOption(mapInfo, "shop");

  const markers = prepareMarkers(mapInfo, true);
  return (
    <div className="azs-map" style={{ height: '100%' }}>
      <Map mapConfig={mapConfig} markers={markers} />
      {/* <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LayersControl position="topright">
            <LayersControl.Overlay name="Marker with popup">
              <Marker position={center}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Layer group with circles">
              <LayerGroup>
                <Circle
                  center={center}
                  pathOptions={{ fillColor: 'blue' }}
                  radius={200} />
                <Circle
                  center={center}
                  pathOptions={{ fillColor: 'red' }}
                  radius={100}
                  stroke={false} />
                <LayerGroup>
                  <Circle
                    center={[51.51, -0.08]}
                    pathOptions={{ color: 'green', fillColor: 'green' }}
                    radius={100} />
                </LayerGroup>
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer> */}
    </div>
  );
}

export default AzsMap;
