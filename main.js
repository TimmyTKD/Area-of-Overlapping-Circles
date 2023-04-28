let circles = [
  {x: 0, y: 0, r: 5},
  {x: 5, y: 0, r: 5}
];

let area = 0;

for (var i = 0; i < circles.length; i++) {
  let circ = circles[i];
  let points = [];
  let contained = false;

  for (var j = 0; j < circles.length; j++) {
    if (i != j) {
      let circ2 = circles[j];
      let interPoints = interP(circ, circ2);

      if (interPoints.one_is_in_other && circ.r <= circ2.r) {
        contained = true;
        break;
      }

      if (!interPoints.intersect_occurs || (interPoints.one_is_in_other && circ.r > circ2.r) || interPoints.are_equal) {
        continue;
      }

      let inside1 = false;
      for (var k = 0; k < circles.length; k++) {
        if (k != i && k != j) {
          let circ3 = circles[k];

          let d = Math.sqrt(Math.pow(circ3.x - interPoints.p1.x, 2) + Math.pow(circ3.y - interPoints.p1.y, 2));

          if (d < circ3.r) {
            inside1 = true;
            break;
          }
        }
      }

      if (!inside1) {
        points.push({x: interPoints.p1.x, y: interPoints.p1.y, c2: circ2});
      }

      let inside2 = false;
      for (k = 0; k < circles.length; k++) {
        if (k != i && k != j) {
          let circ3 = circles[k];

          let d = Math.sqrt(Math.pow(circ3.x - interPoints.p2.x, 2) + Math.pow(circ3.y - interPoints.p2.y, 2));

          if (d < circ3.r) {
            inside2 = true;
            break;
          }
        }
      }

      if (!inside2) {
        points.push({x: interPoints.p2.x, y: interPoints.p2.y, c2: circ2});
      }
    }
  }

  if (contained) {
    continue;
  }

  if (points.length == 0) {
    area += Math.PI * Math.pow(circ.r, 2);
    continue;
  }

  let angles = points.map(({ x, y, c2 }) => {
    return { x, y, c2, angle: (Math.atan2(y - circ.y, x - circ.x) < 0 ? Math.atan2(y - circ.y, x - circ.x) + 2*Math.PI : Math.atan2(y - circ.y, x - circ.x)) };
  });

  let sorted = angles.sort(function(a, b) { return a.angle - b.angle; });

  let fPoint = sorted[0];

  if (fPoint.angle > Math.PI) {
    fPoint.angle -= 2*Math.PI;
  }

  let X = circ.r * Math.cos(fPoint.angle + 1e-6) + circ.x;
  let Y = circ.r * Math.sin(fPoint.angle + 1e-6) + circ.y;

  if (Math.sqrt(Math.pow(X - fPoint.c2.x, 2) + Math.pow(Y - fPoint.c2.y, 2)) < fPoint.c2.r) {
    let first = sorted.shift();
    sorted.push(first);
  }

  points = sorted;

  const chunkSize = 2;
  for (var i2 = 0; i2 < points.length; i2 += chunkSize) {
    const chunk = points.slice(i2, i2 + chunkSize);    

    if (chunk.length < 2) {
      continue;
    }

    let realX1 = Number((chunk[0].x - circ.x));
    let realY1 = Number((chunk[0].y - circ.y));

    let realX2 = Number((chunk[1].x - circ.x));
    let realY2 = Number((chunk[1].y - circ.y));

    let theta1 = Math.atan2(realY1, realX1);
    let theta2 = Math.atan2(realY2, realX2);

    if (theta1 > theta2) {
      theta1 -= 2*Math.PI;
    }

    area += (1/2 * circ.r * ((theta2 - theta1) * circ.r + circ.x * (Math.sin(theta2) - Math.sin(theta1)) - circ.y * (Math.cos(theta2) - Math.cos(theta1))));
  }
}

console.log(area);

function interP(c1, c2) {
    const result = {
        intersect_count: 0,
        intersect_occurs: true,
        one_is_in_other: false,
        are_equal: false,
        p1: { x: null, y: null },
        p2: { x: null, y: null },
    };

    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;

    const dist = Math.hypot(dy, dx);

    if (dist > c1.r + c2.r) {
        result.intersect_occurs = false;
    }

    if (dist < Math.abs(c1.r - c2.r)) {
        result.intersect_occurs = false;
        result.one_is_in_other = true;
    }

    if (c1.x === c2.x && c1.y === c2.y && c1.r === c2.r) {
        result.are_equal = true;
        result.are_equal = true;
    }

    if (result.intersect_occurs) {
        const centroid = (c1.r * c1.r - c2.r * c2.r + dist * dist) / (2.0 * dist);

        const x2 = c1.x + (dx * centroid) / dist;
        const y2 = c1.y + (dy * centroid) / dist;

        const h = Math.sqrt(c1.r * c1.r - centroid * centroid);

        const rx = -dy * (h / dist);
        const ry = dx * (h / dist);
      
        result.p1.x = (x2 + rx);
        result.p1.y = (y2 + ry);

        result.p2.x = (x2 - rx);
        result.p2.y = (y2 - ry);

        if (result.are_equal) {
            result.intersect_count = null;
        } else if (result.p1.x === result.p2.x && result.p1.y === result.p2.y) {
            result.intersect_count = 1;
        } else {
            result.intersect_count = 2;
        }
    }
    return result;
}
