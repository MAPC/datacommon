export const setupMouseEvents = (map, muniPoly, toProfile) => {
  map.on("mousemove", "hover-fill", (e) => {
    if (!e.features.length) return;
    
    const feature = e.features[0];
    map.getCanvas().style.cursor = "pointer";

    if (!muniPoly?.features) {
      console.warn("Municipality data not available");
      return;
    }

    const hoveredFeature = muniPoly.features.find(
      (f) => f.properties.town.toLowerCase() === feature.properties.town.toLowerCase()
    );

    if (hoveredFeature) {
      const source = map.getSource("ma-fill");
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: [hoveredFeature],
        });
      }
    }
  });

  map.on("mouseleave", "hover-fill", () => {
    map.getCanvas().style.cursor = "";
    const source = map.getSource("ma-fill");
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  });

  map.on("click", "hover-fill", (e) => {
    if (e.features.length && toProfile) {
      const muniName = e.features[0].properties.town
        .toLowerCase()
        .replace(/\s+/g, "-");
      toProfile(muniName);
    }
  });
}; 