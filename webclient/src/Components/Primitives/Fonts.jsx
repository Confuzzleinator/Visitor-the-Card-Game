
import GoogleFontLoader from 'react-google-font-loader';

import React, { Component } from 'react';

export default class Fonts extends Component {
    render() {
        return (
            <div>
                <GoogleFontLoader
      fonts={[
        {
          font: 'Open Sans',
          weights: [400, 700],
        },
        {
          font: 'Quicksand',
          weights: [400, 700],
        },
        {
          font: 'Cinzel',
          weights: [400, 700],
        },
        {
          font: 'Signika',
          weights: [400],
        },
        {
          font: 'Special Elite',
          weights: [400],
        },
        {
          font: 'Metal Mania',
          weights: [400],
        },
      ]}
    />
            </div>
        )
    }
}
