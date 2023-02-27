import {createHigherOrderComponent} from '@wordpress/compose';
import {Fragment} from '@wordpress/element';
import {InspectorControls} from "@wordpress/block-editor";
import {PanelBody, PanelRow, SelectControl, RangeControl, ColorPalette} from "@wordpress/components";
import {addFilter} from '@wordpress/hooks';
import React from "react";
import {select} from "@wordpress/data";

// create a wrapper function which will receive the block we are trying to wrap
function blockWrapper(WrappedBlock) {
	// return a React component
	return class extends React.Component {
		render() {
			let {attributes, setAttributes} = this.props;

			let settings = select('core/editor').getEditorSettings();

			let divStyles = {
				borderStyle: attributes.borderStyle || 'none',
				borderWidth: '2px',
				borderColor: 'black',
			}

			return (
				<Fragment>
					{/* This is panel/toolbar we are adding to each block */}
					<InspectorControls>
						<PanelBody title="Border Controls" initialOpen={false}>
							<PanelRow>
								<SelectControl
									label="Border Style"
									value={attributes.borderStyle}
									onChange={borderStyle => setAttributes({borderStyle})}
									options={[
										{label: 'None', value: 'none'},
										{label: 'Solid', value: 'solid'},
										{label: 'Dashed', value: 'dashed'},
										{label: 'Dotted', value: 'dotted'},
									]}
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl
									label="Border Width"
									value={attributes.borderWidth}
									onChange={borderWidth => setAttributes({borderWidth})}
									min={0.5}
									max={5}
									step={0.5}
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl
									label="Border Radius"
									value={attributes.borderRadius}
									onChange={borderRadius => setAttributes({borderRadius})}
									min={0}
									max={10}
									step={1}
								/>
							</PanelRow>
							<PanelRow>
								<ColorPalette
									label="Border Color"
									colors={ settings.colors }
									value={attributes.borderColor}
									onChange={borderColor => setAttributes({borderColor})}
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>

					{/* This is a wrapper -- WrappedBlock is the block you are editing/wrapping */}
					<div className="wp-block" style={divStyles}>
						<WrappedBlock {...this.props} />
					</div>
				</Fragment>
			)
		}
	}
}

// Higher Order Components is a pretty high-level concept, but here's a good explanation:
// https://reactjs.org/docs/higher-order-components.html
// Note: this is *similar* to what WordPress does, but WordPress does not provide good documentation for this.
const borderComponent = createHigherOrderComponent(blockWrapper, 'border-control');

// register our filter with WordPress
addFilter('editor.BlockEdit', 'nr-blocklibrary/border-control/border-wrapper', borderComponent);
