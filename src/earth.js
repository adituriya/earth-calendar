/**
 * Render an image of the Earth on the provided SVG object.
 * Adapted from http://superawesomevectors.com/globe-flat-vector/
 * N.B. the license does not allow resale. https://superawesomevectors.com/licence/
 * 
 * @param {Object} svg SVG.js object
 * @param {String} waterColor Background color for oceans
 * @param {String} landColor Background color for land masses
 */
export function svgEarth (svg, cx, cy, rotation, waterColor, landColor) {

  // Rotate the drawing (so that it rotates back into position when the drawing is rotated)
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)
  const g = svg.group().transform({
    // Flip the drawing vertically and position it so it is centred at [cx,cy]
    // a: cos, b: -sin, c: sin, d: -cos, e: -414 + cx, f: 318 + cy
    translate: [cx-414, cy+118],
    flip: 'y',
    // rotate: rotation,
    // relative: [-212, 159],
    origin: [200, 200]
  })

  g.path(
    'm 0,0 c 18.826,-81.506 -30.381,-162.469 -109.905,-180.837 -79.528,-18.368 -159.256,32.814 -178.081,114.319 -18.826,81.507 30.382,162.471 109.906,180.838 C -98.552,132.69 -18.822,81.505 0,0'
  ).fill(waterColor).transform({
    a: 1, b: 0, c: 0, d: 1, e: 562.5703, f: 355.6021
  })
  g.path(
    'm 0,0 c -0.391,-0.335 -0.498,-0.689 -0.36,-1.186 0.151,-0.544 0.218,-1.11 0.343,-1.784 -1.674,-0.099 -3.204,-0.187 -4.77,-0.279 -0.155,0.675 -0.31,1.298 -0.444,1.925 -0.132,0.632 -0.247,1.267 -0.368,1.902 -0.054,0.301 -0.02,0.563 0.178,0.836 0.422,0.581 0.799,1.201 1.2,1.798 0.064,0.098 0.155,0.216 0.259,0.246 0.99,0.32 1.984,0.624 3.029,0.949 C -0.29,3.263 0.33,2.168 0.974,1.019 0.644,0.67 0.344,0.307 0,0 m -14.345,-15.861 c 0.084,-0.364 0.172,-0.744 0.27,-1.164 0.613,0.022 1.199,0.041 1.745,0.061 0.219,-0.953 0.472,-1.84 0.613,-2.743 0.108,-0.663 0.277,-1.236 0.785,-1.716 0.542,-0.512 1.021,-1.09 1.523,-1.642 0.131,-0.143 0.246,-0.3 0.418,-0.516 -0.243,-0.084 -0.418,-0.162 -0.594,-0.205 -2.651,-0.615 -5.299,-1.218 -7.947,-1.85 -0.445,-0.104 -0.761,-0.037 -1.065,0.302 -0.212,0.241 -0.502,0.416 -0.714,0.66 -0.788,0.906 -1.798,1.378 -2.974,1.536 -0.314,0.042 -0.62,0.148 -1.018,0.246 1.243,2.244 2.611,4.346 3.174,6.864 -0.135,0.103 -0.283,0.23 -0.441,0.336 -0.355,0.232 -0.698,0.491 -1.076,0.675 -1.984,0.958 -3.254,2.665 -4.581,4.314 -0.259,0.324 -0.351,0.676 -0.401,1.09 -0.122,1.014 -0.317,2.018 -0.502,3.024 -0.078,0.416 -0.185,0.823 -0.296,1.295 0.465,0.211 0.855,0.426 1.27,0.559 0.407,0.131 0.677,0.384 0.926,0.709 0.832,1.09 1.684,2.163 2.52,3.255 0.216,0.291 0.462,0.414 0.832,0.492 0.775,0.159 1.523,0.454 2.277,0.702 0.374,0.123 0.748,0.261 1.166,0.408 1.004,-1.513 1.955,-2.938 2.985,-4.479 -0.354,-0.083 -0.6,-0.154 -0.852,-0.196 -0.765,-0.123 -1.526,-0.251 -2.291,-0.347 -0.385,-0.049 -0.58,-0.244 -0.634,-0.615 -0.009,-0.074 -0.046,-0.148 -0.037,-0.218 0.102,-1.01 -0.302,-1.901 -0.653,-2.804 -0.047,-0.111 -0.064,-0.234 -0.111,-0.412 0.337,-0.246 0.653,-0.529 1.02,-0.723 0.56,-0.296 0.813,-0.748 0.941,-1.346 0.121,-0.547 0.33,-1.076 0.522,-1.669 1.351,0.397 2.61,0.767 3.925,1.154 0.939,-0.883 1.88,-1.764 2.9,-2.724 -1.25,-0.797 -2.423,-1.545 -3.625,-2.313 m -23.865,-0.96 c -0.493,-0.141 -0.647,-0.463 -0.688,-0.935 -0.037,-0.494 -0.135,-0.984 -0.208,-1.491 -0.163,-0.055 -0.297,-0.119 -0.438,-0.148 -1.271,-0.246 -2.541,-0.5 -3.818,-0.719 -0.249,-0.044 -0.542,0.008 -0.791,0.096 -0.775,0.269 -1.543,0.566 -2.306,0.876 -0.326,0.133 -0.607,0.151 -0.91,-0.061 -0.882,-0.63 -1.856,-0.691 -2.906,-0.541 -1.207,0.176 -2.432,0.216 -3.643,0.349 -0.617,0.069 -1.176,-0.045 -1.744,-0.276 -2.029,-0.826 -4.066,-1.632 -6.101,-2.443 -0.183,-0.074 -0.377,-0.119 -0.606,-0.19 -0.3,0.369 -0.591,0.733 -0.939,1.16 -0.532,-0.202 -1.081,-0.41 -1.686,-0.641 -0.07,0.203 -0.152,0.375 -0.189,0.557 -0.15,0.731 -0.348,1.461 -0.407,2.202 -0.035,0.468 0.15,0.952 0.229,1.393 0.204,0.057 0.305,0.121 0.394,0.106 1.016,-0.163 1.373,0.622 1.801,1.274 0.094,0.141 0.121,0.394 0.065,0.556 -0.495,1.347 -0.269,2.701 -0.094,4.061 0.036,0.266 0.074,0.531 0.122,0.854 0.574,-0.148 1.094,-0.313 1.627,-0.411 0.357,-0.066 0.738,-0.088 1.093,-0.037 0.976,0.136 1.942,0.32 2.995,0.367 -0.504,-0.632 -1.007,-1.263 -1.565,-1.964 0.516,-0.207 0.969,-0.393 1.425,-0.573 0.418,-0.165 0.861,-0.283 1.248,-0.498 0.524,-0.292 1.002,-0.189 1.501,0.015 0.578,0.236 1.151,0.476 1.735,0.689 0.332,0.119 0.543,0.308 0.647,0.655 0.179,0.595 0.388,1.177 0.612,1.846 -0.873,0.217 -1.683,0.418 -2.66,0.662 2.572,2.053 4.964,4.125 7.663,6.068 -0.021,-0.504 0.018,-0.883 -0.071,-1.23 -0.059,-0.234 -0.251,-0.499 -0.458,-0.623 -0.629,-0.374 -0.928,-0.851 -0.745,-1.596 0.056,-0.212 0.022,-0.446 0.039,-0.668 0.088,-1.148 0.109,-2.286 -0.438,-3.352 -0.054,-0.103 -0.053,-0.235 -0.093,-0.43 0.267,0.01 0.485,0.008 0.696,0.034 1.506,0.175 3.015,0.369 4.521,0.531 0.196,0.021 0.462,-0.041 0.603,-0.171 1.739,-1.602 3.467,-3.222 5.195,-4.841 0.013,-0.013 0.013,-0.045 0.041,-0.136 -0.24,-0.125 -0.479,-0.299 -0.748,-0.376 M 84.325,-36.462 c 0.539,0.521 0.977,1.036 1.506,1.421 0.297,0.216 0.741,0.25 1.129,0.312 0.886,0.144 1.775,0.273 2.664,0.381 1.203,0.143 2.332,0.524 3.427,1.019 0.387,0.177 0.677,0.143 1.024,-0.098 2.065,-1.405 4.14,-2.794 6.222,-4.167 0.374,-0.248 0.606,-0.568 0.775,-0.964 0.707,-1.674 1.429,-3.345 2.119,-5.026 0.175,-0.436 0.425,-0.666 0.91,-0.724 1.017,-0.116 2.018,-0.303 3.032,-0.455 0.165,-0.027 0.334,-0.027 0.559,-0.042 0.135,1.742 0.259,3.446 0.398,5.27 0.643,-0.507 1.196,-0.926 1.728,-1.367 0.094,-0.083 0.135,-0.251 0.161,-0.388 0.021,-0.089 -0.006,-0.199 -0.037,-0.293 -0.356,-1.096 -0.06,-2.042 0.49,-3.03 1.077,-1.936 2.061,-3.924 2.998,-5.926 0.485,-1.033 0.798,-2.146 1.178,-3.224 0.553,-1.55 1.095,-3.098 1.638,-4.65 0.523,-1.479 1.044,-2.956 1.539,-4.445 0.202,-0.608 0.459,-1.117 1.001,-1.513 1.136,-0.82 2.21,-1.712 3.325,-2.556 0.358,-0.268 0.57,-0.585 0.695,-1.016 0.353,-1.196 0.744,-2.379 1.141,-3.559 0.058,-0.176 0.182,-0.363 0.33,-0.469 2.372,-1.701 4.75,-3.391 7.136,-5.078 0.054,-0.039 0.135,-0.037 0.303,-0.079 -0.347,0.661 -0.623,1.268 -0.967,1.837 -0.835,1.378 -1.381,2.86 -1.782,4.418 -0.313,1.23 -0.738,2.435 -1.088,3.658 -0.084,0.276 -0.253,0.409 -0.482,0.527 -0.727,0.379 -1.452,0.776 -2.186,1.14 -0.439,0.214 -0.813,0.482 -1.075,0.898 -0.077,0.126 -0.185,0.236 -0.273,0.357 -1.331,1.846 -2.769,3.596 -4.461,5.126 -0.276,0.246 -0.404,0.522 -0.43,0.901 -0.125,1.567 -0.29,3.128 -0.428,4.693 -0.041,0.485 -0.186,0.911 -0.476,1.312 -0.676,0.925 -1.32,1.877 -2.01,2.874 0.528,0.512 1.037,1.011 1.606,1.568 0.495,-0.732 0.974,-1.394 1.401,-2.089 0.297,-0.481 0.671,-0.845 1.157,-1.136 1.323,-0.797 2.631,-1.628 3.948,-2.443 0.165,-0.101 0.34,-0.192 0.559,-0.317 0.084,0.214 0.171,0.385 0.222,0.566 0.809,2.648 1.601,5.303 2.419,7.947 0.125,0.422 0.125,0.76 -0.191,1.092 -1.213,1.277 -1.796,2.852 -2.012,4.567 -0.145,1.123 -0.697,1.945 -1.513,2.717 -2.611,2.468 -5.154,5.006 -7.745,7.494 -0.404,0.386 -0.525,0.758 -0.495,1.309 0.091,1.666 0.209,3.34 0.124,5.003 -0.05,0.97 0.192,1.754 0.674,2.53 1.18,1.915 2.534,3.701 4.084,5.411 -0.307,0.821 -0.613,1.66 -0.934,2.493 -0.764,1.997 -1.536,3.993 -2.3,5.991 -4.492,6.955 -9.501,13.479 -14.965,19.53 -0.118,0.042 -0.24,0.088 -0.361,0.128 -0.384,0.135 -0.606,0.32 -0.728,0.741 -0.047,0.16 -0.105,0.32 -0.154,0.48 -23.442,25.338 -54.918,42.072 -89.036,46.738 -0.044,-0.051 -0.09,-0.1 -0.13,-0.162 C 11.057,59.843 10.394,58.94 9.729,58.002 8.699,58.14 7.695,58.27 6.694,58.408 5.07,58.632 3.446,58.857 1.826,59.088 1.607,59.12 1.401,59.196 1.192,59.251 1.045,59.22 0.896,59.186 0.751,59.152 0.239,58.519 -0.296,57.901 -0.785,57.249 c -0.38,-0.512 -0.859,-0.701 -1.483,-0.681 -0.44,0.015 -0.888,-0.044 -1.334,-0.096 -0.295,-0.034 -0.562,-0.106 -0.748,-0.408 -0.586,-0.958 -1.192,-1.899 -1.845,-2.932 2.354,-1.27 4.663,-2.515 6.97,-3.76 -0.017,-0.045 -0.03,-0.094 -0.05,-0.141 -0.981,0.079 -1.961,0.155 -2.945,0.242 -0.994,0.088 -1.981,0.152 -2.965,0.298 -0.798,0.118 -1.496,-0.082 -2.213,-0.39 -1.156,-0.499 -2.341,-0.939 -3.598,-1.437 0.725,-1.543 1.701,-2.914 2.365,-4.501 -2.177,1.142 -4.349,2.284 -6.597,3.468 -0.037,-0.263 -0.081,-0.445 -0.081,-0.628 -0.03,-1.22 -0.074,-2.436 -0.063,-3.656 0.007,-0.402 -0.146,-0.607 -0.476,-0.731 -0.535,-0.196 -1.078,-0.392 -1.617,-0.572 -1.182,-0.393 -2.368,-0.767 -3.547,-1.164 -1.149,-0.388 -2.301,-0.797 -3.446,-1.198 -0.54,-0.187 -1.092,-0.349 -1.621,-0.564 -1.213,-0.492 -2.425,-0.997 -3.625,-1.526 -1.25,-0.549 -2.48,-1.137 -3.719,-1.702 -0.371,-0.167 -0.738,-0.204 -1.156,-0.059 -1.246,0.433 -2.506,0.821 -3.8,1.239 -0.852,-0.999 -1.695,-1.978 -2.56,-2.992 -0.577,0.232 -1.132,0.45 -1.682,0.675 -2.789,1.142 -5.588,2.275 -8.375,3.44 -0.528,0.222 -0.985,0.187 -1.499,-0.017 -0.994,-0.395 -2.006,-0.743 -3.01,-1.108 -1.029,-0.374 -2.055,-0.746 -3.083,-1.117 -0.352,-0.126 -0.702,-0.258 -1.058,-0.365 -1.736,-0.523 -3.215,-1.547 -4.77,-2.419 -3.98,-2.234 -7.954,-4.481 -11.919,-6.74 -0.285,-0.164 -0.564,-0.419 -0.729,-0.701 -0.707,-1.204 -1.375,-2.43 -2.047,-3.657 -0.209,-0.382 -0.48,-0.67 -0.861,-0.901 -2.084,-1.252 -4.147,-2.54 -6.238,-3.781 -0.488,-0.291 -0.761,-0.641 -0.916,-1.178 -0.376,-1.321 -0.804,-2.623 -1.209,-3.933 -0.036,-0.115 -0.058,-0.234 -0.117,-0.491 0.617,0.284 1.136,0.521 1.653,0.759 1.058,0.488 2.114,0.976 3.173,1.46 0.13,0.059 0.276,0.126 0.41,0.121 0.865,-0.033 1.73,-0.087 2.678,-0.138 -1.1,-2.629 -2.171,-5.195 -3.244,-7.76 4.452,2.956 7.839,6.975 11.484,10.897 -1.061,0.559 -2.08,1.096 -3.163,1.666 0.229,0.208 0.379,0.36 0.545,0.493 3.125,2.517 6.259,5.02 9.372,7.547 0.429,0.347 0.806,0.474 1.352,0.272 0.77,-0.281 1.575,-0.466 2.365,-0.7 0.181,-0.053 0.355,-0.128 0.649,-0.238 -1.328,-0.797 -2.689,-1.298 -3.799,-2.237 -1.081,-0.915 -2.229,-1.747 -3.433,-2.682 0.772,-0.368 1.417,-0.776 2.121,-0.977 0.47,-0.132 1.029,0 1.539,0.07 0.912,0.123 1.815,0.306 2.728,0.429 0.338,0.046 0.697,0.027 1.036,-0.024 0.729,-0.104 1.455,-0.251 2.21,-0.515 -0.184,-0.091 -0.366,-0.194 -0.556,-0.271 -2.564,-1.038 -5.128,-2.08 -7.806,-2.795 -0.426,-0.114 -0.75,-0.319 -0.945,-0.759 -0.332,-0.748 -0.73,-1.468 -1.105,-2.214 0.657,-0.527 1.256,-1.007 1.91,-1.529 -0.187,-0.155 -0.322,-0.294 -0.476,-0.389 -1.448,-0.882 -2.891,-1.764 -4.348,-2.623 -0.266,-0.157 -0.593,-0.249 -0.901,-0.295 -0.617,-0.088 -1.239,-0.143 -1.862,-0.168 -0.342,-0.012 -0.546,-0.143 -0.714,-0.431 -0.409,-0.686 -0.859,-1.348 -1.262,-2.037 -0.192,-0.329 -0.434,-0.519 -0.815,-0.571 -1.962,-0.266 -3.692,-1.131 -5.388,-2.089 -0.799,-0.451 -1.621,-0.86 -2.495,-1.322 -0.526,0.631 -0.893,1.331 -1.279,2.013 -0.071,0.126 0.044,0.381 0.111,0.562 0.309,0.843 0.635,1.68 0.947,2.522 0.083,0.219 0.143,0.448 0.111,0.738 -0.696,-0.625 -1.393,-1.25 -2.083,-1.88 -1.49,-1.363 -2.996,-2.709 -4.456,-4.102 -0.911,-0.87 -1.951,-1.558 -3.03,-2.156 -1.976,-1.093 -3.645,-2.495 -4.938,-4.349 -0.281,-0.405 -0.631,-0.761 -1.013,-1.112 0.158,1.189 -0.016,2.449 0.885,3.44 0.233,0.256 0.351,0.536 0.186,0.882 -0.492,1.023 -0.485,2.125 -0.506,3.221 -0.008,0.472 -0.079,0.954 -0.015,1.418 0.077,0.573 -0.183,0.832 -0.67,0.982 -0.116,0.036 -0.228,0.092 -0.467,0.184 0.396,0.283 0.693,0.578 1.051,0.733 0.883,0.388 1.184,0.987 0.984,1.939 -0.126,0.611 -0.207,1.194 -0.6,1.728 -0.338,0.462 -0.668,0.768 -1.266,0.711 -0.245,-0.022 -0.492,0.022 -0.777,0.039 -0.027,-0.13 -0.093,-0.253 -0.071,-0.358 0.211,-0.876 -0.153,-1.67 -0.36,-2.481 -0.079,-0.313 -0.31,-0.623 -0.549,-0.856 -0.795,-0.768 -1.282,-1.696 -1.585,-2.823 0.485,-0.016 0.934,-0.033 1.4,-0.049 -0.006,-0.136 0.015,-0.224 -0.017,-0.274 -0.541,-0.856 -0.709,-1.803 -0.61,-2.786 0.049,-0.502 -0.165,-0.728 -0.592,-0.884 -0.675,-0.251 -1.332,-0.563 -2.016,-0.794 -1.039,-0.35 -1.719,-1.135 -2.508,-1.925 0.617,-0.32 1.186,-0.617 1.892,-0.981 -0.696,-0.328 -1.282,-0.611 -1.875,-0.88 -0.52,-0.235 -1.065,-0.427 -1.565,-0.7 -0.322,-0.172 -0.595,-0.441 -0.868,-0.69 -0.343,-0.319 -0.663,-0.661 -1.125,-1.124 1.417,-0.062 2.635,-0.6 3.914,0.057 0.744,0.383 1.576,0.608 2.373,0.883 0.374,0.126 0.711,0.158 1.129,-0.062 0.67,-0.351 1.451,-0.339 2.196,-0.235 0.281,0.041 0.541,0.255 0.808,0.388 0.034,-0.045 0.064,-0.091 0.098,-0.138 -0.379,-0.345 -0.754,-0.694 -1.135,-1.038 -0.424,-0.387 -0.876,-0.746 -1.27,-1.162 -0.332,-0.35 -0.684,-0.418 -1.142,-0.34 -0.735,0.128 -1.479,0.212 -2.224,0.279 -0.224,0.021 -0.515,-0.008 -0.685,-0.135 -1.37,-1.034 -2.723,-2.097 -4.075,-3.154 -0.037,-0.027 -0.05,-0.081 -0.105,-0.174 0.413,-0.502 0.827,-1.029 1.27,-1.528 0.265,-0.298 0.315,-0.559 0.145,-0.941 -0.599,-1.343 -1.155,-2.706 -1.734,-4.058 -0.09,-0.202 -0.196,-0.41 -0.339,-0.578 -1.198,-1.435 -2.406,-2.861 -3.634,-4.314 -1.543,0.308 -3.075,0.613 -4.677,0.933 -0.455,-0.873 -0.913,-1.748 -1.367,-2.629 -1.873,-3.637 -3.736,-7.279 -5.616,-10.914 -0.591,-1.149 -0.604,-1.139 0.14,-2.233 0.772,-1.129 1.538,-2.263 2.311,-3.403 0.689,0.158 1.349,0.281 1.99,0.463 1.223,0.349 2.441,0.714 3.651,1.105 0.538,0.175 1.07,0.394 1.572,0.655 0.797,0.413 1.555,0.9 2.347,1.317 0.402,0.211 0.642,0.506 0.811,0.92 1.127,2.746 2.281,5.483 3.407,8.232 0.16,0.389 0.383,0.671 0.739,0.891 2.749,1.712 5.495,3.43 8.234,5.158 0.318,0.203 0.595,0.26 0.97,0.142 1.688,-0.531 3.395,-1.015 5.082,-1.547 0.317,-0.099 0.633,-0.3 0.869,-0.534 1.729,-1.726 3.445,-3.468 5.146,-5.223 0.252,-0.261 0.437,-0.607 0.588,-0.94 0.49,-1.083 0.95,-2.178 1.481,-3.408 0.413,0.529 0.794,0.948 1.093,1.422 0.484,0.756 1.097,1.246 2.027,1.322 0.441,0.035 0.872,0.189 1.315,0.29 -0.01,0.123 0.01,0.209 -0.023,0.259 -0.682,1.013 -1.314,2.067 -2.072,3.022 -1.535,1.934 -3.128,3.822 -4.72,5.713 -0.364,0.431 -0.8,0.818 -1.248,1.165 -0.784,0.608 -1.602,1.169 -2.408,1.75 0.011,0.052 0.021,0.107 0.029,0.16 1.218,0.049 2.438,0.098 3.704,0.152 0.115,0.664 0.218,1.27 0.337,1.944 0.165,-0.098 0.319,-0.157 0.438,-0.258 2.237,-1.875 4.476,-3.751 6.696,-5.645 0.256,-0.215 0.479,-0.51 0.628,-0.812 0.92,-1.878 1.808,-3.769 2.721,-5.648 0.104,-0.214 0.266,-0.434 0.461,-0.559 1.387,-0.888 2.792,-1.75 4.191,-2.619 0.037,-0.022 0.095,-0.016 0.226,-0.034 -0.027,0.276 -0.045,0.536 -0.086,0.793 -0.229,1.454 -0.446,2.909 -0.707,4.358 -0.078,0.428 0.016,0.767 0.22,1.129 0.573,1.024 1.132,2.057 1.668,3.098 0.157,0.308 0.453,0.606 0.225,1.029 -0.042,0.079 0.085,0.271 0.165,0.391 0.545,0.806 1.106,1.603 1.638,2.417 0.192,0.291 0.46,0.362 0.765,0.38 1.14,0.06 2.284,0.112 3.424,0.176 0.307,0.015 0.512,-0.079 0.655,-0.374 0.701,-1.43 1.485,-2.824 2.113,-4.286 0.526,-1.233 0.881,-2.54 1.309,-3.813 0.344,-1.016 0.658,-2.04 1.034,-3.042 0.082,-0.218 0.349,-0.413 0.576,-0.519 0.816,-0.376 1.643,-0.729 2.478,-1.055 1.892,-0.736 3.637,-1.756 5.416,-2.72 0.237,-0.13 0.478,-0.255 0.812,-0.43 0.527,0.736 1.066,1.444 1.551,2.188 0.672,1.031 2.255,1.294 3.143,0.491 0.342,-0.31 0.468,-0.62 0.288,-1.114 -1.368,-3.748 -2.712,-7.504 -4.042,-11.266 -0.169,-0.476 -0.422,-0.704 -0.917,-0.839 -1.37,-0.368 -2.722,-0.805 -4.071,-1.237 -0.386,-0.127 -0.713,-0.092 -1.077,0.064 -1.125,0.474 -2.263,0.921 -3.401,1.377 -0.156,0.063 -0.323,0.106 -0.54,0.175 -0.531,-1.197 -1.058,-2.378 -1.591,-3.576 -1.797,0.052 -3.561,0.1 -5.321,0.155 -1.539,0.051 -3.081,0.123 -4.62,0.16 -0.46,0.01 -0.789,0.15 -1.065,0.539 -0.615,0.875 -1.275,1.715 -1.942,2.6 -1.366,-0.864 -2.685,-1.7 -4.006,-2.532 -0.483,-0.307 -0.95,-0.644 -1.457,-0.905 -0.463,-0.239 -0.6,-0.591 -0.636,-1.074 -0.095,-1.242 -0.233,-2.478 -0.356,-3.716 -0.018,-0.166 -0.062,-0.329 -0.103,-0.541 -1.469,0.195 -2.895,0.384 -4.319,0.576 -0.544,0.072 -1.085,0.192 -1.63,0.214 -0.539,0.02 -0.774,0.303 -0.954,0.764 -0.485,1.227 -1.012,2.438 -1.548,3.724 -0.759,-0.019 -1.524,-0.033 -2.289,-0.058 -1.194,-0.042 -2.39,-0.083 -3.583,-0.142 -0.391,-0.02 -0.721,0.075 -1.051,0.29 -0.745,0.492 -1.513,0.953 -2.32,1.461 1.355,2.701 2.691,5.362 4.114,8.198 -0.438,-0.103 -0.691,-0.16 -0.948,-0.219 -2.529,-0.583 -5.057,-1.176 -7.589,-1.742 -0.378,-0.082 -0.792,-0.092 -1.174,-0.037 -1.255,0.186 -2.51,0.388 -3.755,0.645 -0.566,0.118 -0.982,0.025 -1.435,-0.343 -1.545,-1.263 -3.133,-2.473 -4.688,-3.721 -0.359,-0.289 -0.697,-0.389 -1.159,-0.32 -1.826,0.269 -3.657,0.48 -5.484,0.744 -0.427,0.062 -0.686,-0.052 -0.96,-0.37 -2.426,-2.786 -4.86,-5.559 -7.306,-8.328 -0.248,-0.282 -0.361,-0.572 -0.357,-0.942 0.015,-1.391 0.012,-2.788 0.023,-4.179 0.004,-0.368 -0.101,-0.659 -0.345,-0.949 -2.296,-2.73 -4.56,-5.486 -6.867,-8.208 -0.59,-0.696 -1.035,-1.461 -1.442,-2.259 -1.643,-3.222 -3.294,-6.438 -4.917,-9.667 -0.152,-0.297 -0.215,-0.664 -0.226,-1.002 -0.221,-6.159 -0.428,-12.322 -0.645,-18.481 -0.009,-0.264 -0.095,-0.527 -0.147,-0.79 0.046,-0.195 0.091,-0.391 0.135,-0.584 0.266,-0.522 0.571,-1.03 0.788,-1.572 0.703,-1.752 1.366,-3.522 2.052,-5.281 0.689,-1.757 1.405,-3.505 2.077,-5.27 0.591,-1.557 1.228,-3.095 1.632,-4.726 0.343,-1.399 0.81,-2.771 1.255,-4.145 0.066,-0.214 0.27,-0.408 0.451,-0.561 1.929,-1.619 3.868,-3.226 5.8,-4.839 1.434,-1.2 2.865,-2.404 4.299,-3.605 0.15,-0.126 0.308,-0.245 0.542,-0.424 1.099,1.051 2.187,2.095 3.317,3.171 1.481,-0.593 2.958,-1.184 4.464,-1.787 3.222,2.356 6.436,4.703 9.697,7.086 0.664,-0.929 1.286,-1.797 1.902,-2.668 1.024,-1.441 2.062,-2.878 3.061,-4.337 0.306,-0.449 0.658,-0.661 1.206,-0.705 2.01,-0.165 4.017,-0.372 6.024,-0.565 0.22,-0.022 0.439,-0.058 0.692,-0.09 0.263,-1.318 0.522,-2.616 0.775,-3.909 0.508,-2.595 1.026,-5.186 1.514,-7.786 0.083,-0.438 0.265,-0.785 0.541,-1.118 2.579,-3.107 5.137,-6.233 7.732,-9.325 0.601,-0.722 1.064,-1.483 1.394,-2.359 1.055,-2.796 2.136,-5.579 3.209,-8.368 0.189,-0.492 0.452,-0.931 0.821,-1.317 1.13,-1.194 2.228,-2.423 3.36,-3.616 0.317,-0.337 0.436,-0.646 0.356,-1.125 -0.364,-2.135 -0.633,-4.292 -1.033,-6.422 -0.182,-0.979 -0.025,-1.845 0.329,-2.749 0.796,-2.01 1.551,-4.042 2.311,-6.07 0.168,-0.451 0.407,-0.829 0.783,-1.152 2.405,-2.062 4.794,-4.144 7.181,-6.226 0.278,-0.243 0.536,-0.522 0.751,-0.822 2.259,-3.133 4.536,-6.256 6.743,-9.427 1.323,-1.892 2.889,-3.54 4.597,-5.08 2.256,-2.038 4.457,-4.137 6.703,-6.185 0.605,-0.552 0.771,-1.321 1.105,-2.001 0.296,-0.6 0.535,-1.227 0.781,-1.853 0.176,-0.448 0.497,-0.697 0.935,-0.89 2.534,-1.101 5.064,-2.226 7.594,-3.355 0.168,-0.074 0.31,-0.209 0.464,-0.316 0.098,0.019 0.199,0.046 0.294,0.067 0.006,1.165 0.01,2.331 0.017,3.544 0.923,0.094 1.799,0.195 2.681,0.279 0.987,0.098 1.971,0.182 2.958,0.274 1.358,0.128 2.719,0.249 4.073,0.377 0.543,0.053 1.085,0.121 1.631,0.168 0.401,0.034 0.674,0.222 0.909,0.552 3.332,4.677 6.678,9.339 10.013,14.009 0.101,0.141 0.195,0.286 0.34,0.498 -0.168,0.253 -0.343,0.519 -0.522,0.775 -0.509,0.742 -1.004,1.489 -1.546,2.207 -0.266,0.357 -0.31,0.67 -0.169,1.094 0.674,2.066 1.294,4.145 1.982,6.206 0.161,0.493 0.053,0.762 -0.33,1.078 -2.133,1.769 -4.243,3.558 -6.358,5.347 -0.185,0.151 -0.354,0.323 -0.603,0.563 1.236,0.404 2.358,0.795 3.497,1.138 0.39,0.118 0.66,0.297 0.852,0.654 0.957,1.802 2.308,3.298 3.713,4.756 2.682,2.787 5.319,5.614 7.974,8.423 0.172,0.182 0.33,0.37 0.539,0.6 -0.138,0.235 -0.263,0.472 -0.405,0.697 -2.381,3.895 -4.752,7.792 -7.159,11.674 -0.653,1.044 -1.155,2.143 -1.549,3.301 -0.459,1.347 -0.896,2.709 -1.456,4.012 -0.316,0.746 -0.832,1.409 -1.31,2.073 -0.741,1.024 -0.387,0.876 -1.694,0.73 -0.89,-0.097 -1.78,-0.225 -2.82,-0.356 0.205,0.34 0.336,0.569 0.471,0.788 3.669,5.858 7.351,11.714 10.993,17.588 0.829,1.332 1.526,2.747 2.288,4.12 0.825,1.482 1.623,2.983 2.496,4.435 0.411,0.677 0.99,1.245 1.459,1.883 0.326,0.442 0.651,0.893 0.889,1.382 1.719,3.491 3.443,6.98 5.104,10.499 1.099,2.324 2.096,4.694 3.144,7.041 0.256,0.579 0.387,1.172 0.437,1.806 0.293,3.628 0.614,7.257 0.923,10.883 0.021,0.298 0.034,0.596 0.055,0.917 -0.311,0.107 -0.479,-0.125 -0.668,-0.253 -3.184,-2.192 -6.367,-4.391 -9.551,-6.588 -2.563,-1.769 -5.14,-3.524 -7.694,-5.311 -0.428,-0.299 -0.818,-0.374 -1.317,-0.262 -0.995,0.226 -1.995,0.4 -3.063,0.609 0.367,1.304 0.714,2.545 1.088,3.867 -0.751,0.248 -1.476,0.495 -2.21,0.726 -3.705,1.184 -7.412,2.36 -11.114,3.548 -0.428,0.138 -0.839,0.32 -1.24,0.527 -1.021,0.525 -2.024,1.075 -3.103,1.654 0.125,2.273 0.253,4.555 0.385,6.906 -0.206,0.075 -0.405,0.164 -0.614,0.22 -1.752,0.481 -3.51,0.977 -5.269,1.43 -0.438,0.111 -0.684,0.331 -0.828,0.744 -0.644,1.834 -1.307,3.661 -1.951,5.498 -0.152,0.445 -0.374,0.822 -0.761,1.068 -0.846,0.534 -1.681,1.083 -2.561,1.545 -0.685,0.355 -1.219,0.803 -1.652,1.45 -1.22,1.825 -2.468,3.63 -3.765,5.401 -0.657,0.892 -0.923,1.927 -1.277,2.931 -0.943,2.678 -1.853,5.37 -2.774,8.058 -0.022,0.063 -0.016,0.135 -0.037,0.396 1.258,-1.511 2.412,-2.897 3.566,-4.28 0.047,0.013 0.097,0.029 0.148,0.042 0.152,1.337 0.101,2.693 0.232,4.178 0.324,-0.363 0.556,-0.614 0.78,-0.872 1.053,-1.202 2.138,-2.375 3.14,-3.613 0.77,-0.948 1.437,-1.972 2.138,-2.971 0.488,-0.694 1,-1.375 1.422,-2.105 1.01,-1.744 2.529,-3.006 3.985,-4.328 0.923,-0.84 1.637,-1.764 2.123,-2.922 0.623,-1.468 1.38,-2.876 2.048,-4.321 0.202,-0.437 0.472,-0.618 0.953,-0.664 1.115,-0.104 2.224,-0.298 3.339,-0.403 0.465,-0.044 0.687,-0.239 0.873,-0.652 0.552,-1.201 1.158,-2.375 1.731,-3.561 0.199,-0.419 0.482,-0.724 0.886,-0.968 1.681,-1.028 3.339,-2.091 5.023,-3.12 0.377,-0.232 0.64,-0.517 0.836,-0.913 1.249,-2.466 2.52,-4.92 3.786,-7.378 0.114,-0.221 0.237,-0.438 0.384,-0.711 0.974,0.105 1.965,0.189 2.945,0.329 0.408,0.059 0.71,-0.015 1.028,-0.282 0.485,-0.416 1.006,-0.791 1.556,-1.219 0.414,0.522 0.782,0.989 1.149,1.455 0.788,0.999 1.462,2.126 2.391,2.963 0.91,0.818 2.103,1.318 3.141,1.998 2.352,1.526 4.898,2.665 7.367,3.957 0.391,0.202 0.617,0.453 0.748,0.861 0.404,1.208 0.86,2.393 1.26,3.601 0.148,0.448 0.385,0.779 0.775,1.048 1.048,0.719 2.085,1.452 3.093,2.224 0.347,0.26 0.663,0.608 0.886,0.98 1.264,2.124 2.493,4.267 3.729,6.406 0.149,0.258 0.29,0.524 0.398,0.803 0.913,2.401 1.816,4.808 2.719,7.213 0.046,0.115 0.077,0.233 0.141,0.425 -0.542,0.264 -1.068,0.531 -1.603,0.783 -2.14,1.012 -4.279,2.033 -6.435,3.022 -0.422,0.195 -0.678,0.463 -0.852,0.875 -0.31,0.735 -0.644,1.461 -0.967,2.189 -0.115,0.244 -0.237,0.485 -0.391,0.804 -0.169,-0.191 -0.31,-0.319 -0.418,-0.469 -1.233,-1.694 -2.476,-3.384 -3.689,-5.092 -0.333,-0.475 -0.721,-0.753 -1.314,-0.872 -1.466,-0.292 -2.918,-0.657 -4.457,-1.015 0.027,0.216 0.02,0.383 0.077,0.528 0.351,0.958 0.704,1.917 1.078,2.867 0.149,0.369 0.159,0.706 0.021,1.083 -0.357,1.004 -0.69,2.021 -1.055,3.108 -0.192,-0.15 -0.334,-0.235 -0.448,-0.349 -0.718,-0.758 -1.429,-1.533 -2.166,-2.279 -0.263,-0.27 -0.374,-0.566 -0.401,-0.928 -0.043,-0.563 -0.115,-1.122 -0.185,-1.799 -0.206,0.172 -0.337,0.259 -0.445,0.375 -2.786,3.034 -5.562,6.068 -8.352,9.099 -0.228,0.247 -0.397,0.491 -0.384,0.848 0.064,1.318 0.112,2.635 0.172,4.038 0.744,0.037 1.459,0.076 2.17,0.106 0.323,0.012 0.656,-0.044 0.967,0.017 0.644,0.128 1.067,-0.13 1.502,-0.58 1.91,-1.969 3.861,-3.899 5.781,-5.858 0.311,-0.315 0.593,-0.44 1.045,-0.317 0.919,0.248 1.85,0.423 2.766,0.654 0.353,0.089 0.616,0.025 0.883,-0.224 0.693,-0.637 1.411,-1.247 2.159,-1.9 1.759,1.213 3.467,2.397 5.239,3.618 0.521,-0.62 1.01,-1.208 1.502,-1.796 0.064,-0.076 0.142,-0.147 0.188,-0.231 0.307,-0.523 0.735,-0.699 1.359,-0.645 2.354,0.199 4.713,0.344 7.071,0.507 0.249,0.019 0.498,0.056 0.748,0.039 1.398,-0.089 2.523,0.667 3.702,1.226 3.554,1.683 7.102,3.386 10.646,5.079 0.044,0.02 0.097,0.023 0.243,0.057 0.653,-0.423 1.378,-0.862 2.068,-1.349 0.179,-0.124 0.307,-0.382 0.368,-0.605 0.165,-0.576 0.29,-1.163 0.411,-1.75 0.063,-0.311 0.202,-0.531 0.478,-0.711 3.77,-2.442 7.529,-4.898 11.292,-7.349 0.065,-0.041 0.139,-0.059 0.253,-0.11 0.63,0.576 1.257,1.178 1.924,1.737 0.256,0.214 0.579,0.377 0.899,0.472 0.667,0.192 1.355,0.323 2.079,0.492 0.189,-0.816 0.377,-1.579 0.542,-2.347 0.102,-0.512 0.156,-1.034 0.24,-1.55 0.148,-0.86 0.272,-1.723 0.462,-2.573 0.063,-0.299 0.214,-0.619 0.427,-0.838 5.094,-5.304 10.208,-10.597 15.312,-15.893 1.513,-1.559 3.022,-3.119 4.528,-4.678 0.172,-0.175 0.347,-0.346 0.681,-0.685 0.077,0.258 0.1,0.436 0.178,0.588 1.122,2.257 2.244,4.514 3.379,6.763 0.185,0.355 0.229,0.692 0.162,1.078 -0.711,3.876 -1.169,7.788 -1.618,11.699 -0.044,0.372 -0.07,0.727 0.169,1.073 2.611,3.773 4.434,7.974 6.489,12.05 1.529,3.029 3.022,6.077 4.531,9.117 0.077,0.157 0.142,0.316 0.239,0.537 -0.711,0.359 -1.418,0.71 -2.21,1.107'
  ).fill(landColor).transform({
    a: 1, b: 0, c: 0, d: 1, e: 424.8037, f: 411.3901
  })
  g.path(
    'm 0,0 c -0.22,3.636 -0.479,7.264 -0.701,10.902 -0.024,0.435 0.044,0.897 0.169,1.314 0.384,1.345 0.798,2.675 1.239,4.003 0.132,0.404 0.084,0.69 -0.205,1.01 -1.264,1.416 -2.514,2.84 -3.753,4.275 -0.216,0.253 -0.452,0.35 -0.771,0.367 -0.699,0.027 -1.392,0.088 -2.089,0.129 -0.493,0.026 -0.981,0.047 -1.594,0.073 0.151,-1.121 0.263,-2.108 0.425,-3.089 0.08,-0.488 0.047,-0.916 -0.172,-1.371 -0.843,-1.728 -1.652,-3.469 -2.456,-5.215 -0.199,-0.431 -0.483,-0.721 -0.89,-0.957 -1.556,-0.889 -3.093,-1.816 -4.652,-2.709 -0.334,-0.191 -0.495,-0.423 -0.549,-0.811 -0.132,-1.015 -0.29,-2.025 -0.479,-3.029 -0.087,-0.461 0.034,-0.795 0.344,-1.146 1.388,-1.566 2.745,-3.159 4.113,-4.746 0.128,-0.146 0.247,-0.3 0.391,-0.482 -1.078,-1.213 -2.133,-2.395 -3.127,-3.514 1.335,-3.193 3.154,-5.986 4.953,-8.789 0.256,-0.398 0.539,-0.587 1.018,-0.587 1.266,0 2.533,-0.03 3.8,-0.067 0.374,-0.013 0.59,0.141 0.774,0.452 0.569,0.943 1.18,1.852 1.735,2.802 0.223,0.377 0.402,0.802 0.499,1.234 0.64,2.796 1.263,5.592 1.87,8.398 C 0,-1.051 0.033,-0.516 0,0'
  ).fill(landColor).transform({
    translate: [441.7197, 233.5059]
  })
  g.path(
    'm 0,0 c -0.041,-0.393 -0.125,-0.788 -0.267,-1.154 -0.599,-1.558 -1.215,-3.113 -1.852,-4.654 -0.179,-0.421 -0.139,-0.733 0.131,-1.1 0.95,-1.304 1.846,-2.651 2.82,-3.943 0.734,-0.971 1.28,-1.99 1.462,-3.212 0.128,-0.86 0.381,-1.704 0.579,-2.549 0.051,-0.214 0.125,-0.425 0.19,-0.657 0.744,0.025 1.481,-0.029 2.216,-0.044 C 4.753,-8.871 3.54,-0.354 1.569,8.175 1.465,8.633 1.348,9.086 1.236,9.542 0.855,7.437 0.481,5.33 0.319,3.19 0.239,2.124 0.128,1.06 0,0'
  ).fill(landColor).transform({
    translate: [561.001, 347.4272]
  })
  g.path(
    'm 0,0 c 0.172,0.128 0.276,0.194 0.367,0.274 1.348,1.291 2.689,2.593 4.053,3.867 0.397,0.368 0.506,0.732 0.348,1.251 -0.49,1.597 -0.93,3.207 -1.422,4.801 -0.077,0.261 -0.304,0.509 -0.519,0.689 -1.092,0.911 -2.2,1.799 -3.308,2.692 -0.186,0.153 -0.388,0.291 -0.58,0.432 -0.097,-0.079 -0.175,-0.114 -0.209,-0.172 -0.68,-1.187 -1.371,-2.373 -2.032,-3.572 -0.077,-0.147 -0.07,-0.387 -0.023,-0.557 0.25,-0.811 0.512,-1.615 0.785,-2.414 0.576,-1.67 1.155,-3.336 1.738,-5 C -0.542,1.544 -0.279,0.8 0,0'
  ).fill(landColor).transform({
    translate: [506.1875, 323.0142]
  })
  g.path(
    'm 0,0 c -0.214,-0.716 -0.652,-1.284 -1.304,-1.66 -0.512,-0.294 -0.802,-0.727 -0.901,-1.295 -0.096,-0.542 -0.339,-0.979 -0.841,-1.246 -0.687,-0.371 -1.007,-0.869 -0.723,-1.692 0.132,-0.38 -10e-4,-0.842 0.307,-1.214 0.699,0.069 1.388,0.143 2.079,0.2 0.852,0.073 1.661,0.216 2.329,0.839 0.455,0.42 0.991,0.747 1.479,1.131 0.174,0.136 0.373,0.288 0.453,0.476 0.223,0.527 0.401,1.073 0.577,1.621 0.04,0.128 0.022,0.298 -0.02,0.429 C 3.113,-1.417 2.774,-0.43 2.425,0.608 1.912,0.621 1.463,0.623 1.017,0.645 0.521,0.672 0.16,0.529 0,0'
  ).fill(landColor).transform({
    translate: [315.0317, 414.7949]
  })
  g.path(
    'm 0,0 c -0.249,0.226 -0.475,0.512 -0.626,0.815 -0.89,1.813 -1.769,3.634 -2.628,5.465 -0.185,0.404 -0.438,0.702 -0.808,0.94 -1.146,0.753 -2.292,1.508 -3.423,2.289 -1.453,1.007 -3.016,1.856 -4.302,3.099 -1.025,0.988 -2.1,1.924 -3.148,2.883 -0.4,0.367 -0.807,0.727 -1.211,1.093 -0.062,-0.024 -0.119,-0.042 -0.183,-0.064 0.027,-0.239 0.034,-0.484 0.081,-0.718 0.175,-0.881 0.377,-1.755 0.553,-2.639 0.128,-0.667 0.374,-1.266 0.76,-1.838 2.184,-3.214 4.273,-6.491 6.51,-9.66 2.773,-3.929 5.659,-7.774 8.499,-11.652 0.092,-0.128 0.223,-0.229 0.358,-0.364 0.057,0.122 0.101,0.185 0.118,0.254 0.657,2.46 1.306,4.921 1.973,7.375 0.102,0.379 -0.016,0.603 -0.299,0.834 C 1.47,-1.275 0.725,-0.65 0,0'
  ).fill(landColor).transform({
    translate: [559.5684, 326.2988]
  })

  return g
}