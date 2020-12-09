import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

export default class MusicPlayer extends React.Component {
    render() {
        return (
            <ReactAudioPlayer
                src={this.props.src}
                autoPlay
                loop
                volume={0.2}
                muted={this.props.muted}
            />
        );
    }
}