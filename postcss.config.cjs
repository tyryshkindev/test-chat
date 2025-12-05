module.exports = {
	plugins: {
		'postcss-preset-env': {
			stage: 3,
			features: {
				'nesting-rules': true,
			},
		},
		autoprefixer: {},
		'postcss-px-conversion': {
			unitToConvert: 'px',
			viewportWidth: 1920,
			unitPrecision: 5,
			propList: ['*', '!border'],
			viewportUnit: 'vw',
			fontViewportUnit: 'vw',
			selectorBlackList: [],
			minPixelValue: 1,
			mediaQuery: false,
			replace: true,
			landscape: false,
		},
	},
};
