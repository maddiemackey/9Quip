import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

export default class MusicPlayer extends React.Component {
    render() {
        return (
            <ReactAudioPlayer
                src="music/cropped-upbeat-music.m4a"
                autoPlay
                loop
                volume={0.2}
                muted={this.props.muted}
            />
        );
    }
}