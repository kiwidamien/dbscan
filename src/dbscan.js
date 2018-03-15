const calcDistanceSq = (pt1, pt2) => {
  const squareDiff = pt1.map((p,index) => (p-pt2[index])*(p-pt2[index]));
  return squareDiff.reduce((accumulator, currentValue) => accumulator + currentValue);
}

const getMetricSquare = (data) => {
    return data.map((pt1) => {
      return data.map((pt2) => calcDistanceSq(pt1, pt2))
    });
}

const getNumberOfNeighbors = (metricSq, radius) => {
  return metricSq.map((row, idx) => row.filter((d2) => d2 < radius*radius).length);
}

const getIndexOfNeighbors = (metricSq, radius) => {
  const neighborList = [];

  metricSq.forEach((row) => {
    const neighbors = [];
    row.forEach((value,index) => {
      if (value < radius*radius) {
        neighbors.push(index);
      }
    });
    neighborList.push(neighbors);
  });
  return neighborList;
}

const getClusterNumber = (metricSq, radius, minPoints) => {
    const neighbors = getIndexOfNeighbors(metricSq, radius);
    const corePoints = [];
    neighbors.forEach((neighborOfPt, index) => {
      if (neighborOfPt.length >= minPoints) {
        corePoints.push(index);
      }
    });

    const placed = Array(metricSq[0].length).fill(0);
    let currentCluster = 0;

    corePoints.forEach( (data_index) => {
      if (!placed[data_index]) {
        currentCluster += 1;
      }

      neighbors[data_index].forEach((new_index) => {placed[new_index] = currentCluster});
    });

    return placed;
}

export {
  getMetricSquare,
  getNumberOfNeighbors,
  getIndexOfNeighbors,
  getClusterNumber
}
