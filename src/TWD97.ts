export function twd97_to_latlng($x: number, $y: number) {
  const pow = Math.pow, M_PI = Math.PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan;
  const $a = 6378137.0, $b = 6356752.314245;
  const $lng0 = 121 * M_PI / 180, $k0 = 0.9999, $dx = 250000, $dy = 0;
  const $e = pow((1 - pow($b, 2) / pow($a, 2)), 0.5);

  $x -= $dx;
  $y -= $dy;

  const $M = $y / $k0;

  const $mu = $M / ($a * (1.0 - pow($e, 2) / 4.0 - 3 * pow($e, 4) / 64.0 - 5 * pow($e, 6) / 256.0));
  const $e1 = (1.0 - pow((1.0 - pow($e, 2)), 0.5)) / (1.0 + pow((1.0 - pow($e, 2)), 0.5));

  const $J1 = (3 * $e1 / 2 - 27 * pow($e1, 3) / 32.0);
  const $J2 = (21 * pow($e1, 2) / 16 - 55 * pow($e1, 4) / 32.0);
  const $J3 = (151 * pow($e1, 3) / 96.0);
  const $J4 = (1097 * pow($e1, 4) / 512.0);

  const $fp = $mu + $J1 * sin(2 * $mu) + $J2 * sin(4 * $mu) + $J3 * sin(6 * $mu) + $J4 * sin(8 * $mu);

  const $e2 = pow(($e * $a / $b), 2);
  const $C1 = pow($e2 * cos($fp), 2);
  const $T1 = pow(tan($fp), 2);
  const $R1 = $a * (1 - pow($e, 2)) / pow((1 - pow($e, 2) * pow(sin($fp), 2)), (3.0 / 2.0));
  const $N1 = $a / pow((1 - pow($e, 2) * pow(sin($fp), 2)), 0.5);

  const $D = $x / ($N1 * $k0);

  const $Q1 = $N1 * tan($fp) / $R1;
  const $Q2 = (pow($D, 2) / 2.0);
  const $Q3 = (5 + 3 * $T1 + 10 * $C1 - 4 * pow($C1, 2) - 9 * $e2) * pow($D, 4) / 24.0;
  const $Q4 = (61 + 90 * $T1 + 298 * $C1 + 45 * pow($T1, 2) - 3 * pow($C1, 2) - 252 * $e2) * pow($D, 6) / 720.0;
  let $lat = $fp - $Q1 * ($Q2 - $Q3 + $Q4);

  const $Q5 = $D;
  const $Q6 = (1 + 2 * $T1 + $C1) * pow($D, 3) / 6;
  const $Q7 = (5 - 2 * $C1 + 28 * $T1 - 3 * pow($C1, 2) + 8 * $e2 + 24 * pow($T1, 2)) * pow($D, 5) / 120.0;
  let $lng = $lng0 + ($Q5 - $Q6 + $Q7) / cos($fp);

  $lat = ($lat * 180) / M_PI;
  $lng = ($lng * 180) / M_PI;

  return {
    lat: $lat,
    lng: $lng
  };
}