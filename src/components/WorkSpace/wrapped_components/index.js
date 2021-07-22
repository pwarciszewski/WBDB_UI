import React from 'react'
import { default as WindowWrapper } from './WindowWrapper'
import { LogList, SelectedFramesList, FrameAttributesList, ImageDisplayer, SelectRoi, RoiManager, ChartDisplayer, CSVDisplayer } from '../components'

export const WrappedLogList = (props) => (
    <WindowWrapper 
      id={props.id}
      z_index={props.z_index}
      window_name='Application logs'
      default_width={400}
      default_height={120}>
        <LogList/>
    </WindowWrapper>
)
    
export const WrappedSelectedFramesList = (props) => (
    <WindowWrapper 
      id={props.id}
      z_index={props.z_index} 
      window_name='Selected frames'
      default_width={250}
      default_height={520}>
        <SelectedFramesList/>
    </WindowWrapper>
)

export const WrappedRoiManager = (props) => (
    <WindowWrapper 
      id={props.id}
      z_index={props.z_index} 
      window_name='ROIs manager'
      default_width={340}
      default_height={320}>
        <RoiManager/>
    </WindowWrapper>
)

export const WrappedAttributesList = (props) => (
    <WindowWrapper   
      id={props.id} 
      z_index={props.z_index}
      window_name='Data frame atributes'
      default_width={600}
      default_height={280}>
        <FrameAttributesList />
    </WindowWrapper>
)

export const WrappedImageDisplayer = (props) => (
    <WindowWrapper
      id={props.id}
      z_index={props.z_index}
      window_name='Image displayer'
      default_width={400}
      default_height={452}
      lock_aspect_ratio={true}>
        <ImageDisplayer/>
    </WindowWrapper>
)

export const WrappedSelectRoi = (props) => (
    <WindowWrapper
      id={props.id}
      z_index={props.z_index}
      window_name='ROIs'
      default_width={600}
      default_height={600}
      resizable={false}>
        <SelectRoi/>
    </WindowWrapper>
)

export const WrappedChartDisplayer = (props) => (
    <WindowWrapper
      id={props.id}
      z_index={props.z_index}
      window_name='Chart'
      default_width={840}
      default_height={370}>
        <ChartDisplayer/>
    </WindowWrapper>
)

export const WrappedCSVDisplayer = (props) => (
    <WindowWrapper
      id={props.id}
      z_index={props.z_index}
      window_name = 'CSV Chart'
      default_width={840}
      default_height={370}>
        <CSVDisplayer/>
    </WindowWrapper>
)