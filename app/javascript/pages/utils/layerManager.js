import colors from "../constants/colors";

export const addMapLayer = (map, layer) => {
  if (!layer || map.getSource(`ma-${layer.type}`)) return;

  map.addSource(`ma-${layer.type}`, {
    type: "geojson",
    data: layer.geojson,
    generateId: true,
  });

  map.addLayer({
    id: `ma-${layer.type}`,
    type: layer.type,
    source: `ma-${layer.type}`,
    paint: layer.type === "fill"
      ? {
          "fill-color": colors.BRAND.PRIMARY,
          "fill-opacity": 0.7,
        }
      : {
          "line-color": colors.BRAND.PRIMARY,
          "line-width": 1,
        },
  });
};

export const updateMapLayers = (map, layers) => {
  layers.forEach((layer) => {
    if (!layer) return;
    
    const source = map.getSource(`ma-${layer.type}`);
    if (source) {
      source.setData(layer.geojson);
    } else {
      addMapLayer(map, layer);
    }
  });
};