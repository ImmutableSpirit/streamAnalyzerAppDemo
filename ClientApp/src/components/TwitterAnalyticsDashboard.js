import React, { Component } from 'react';
import { useState } from "react";
import {
  HubConnectionBuilder,
} from '@microsoft/signalr';


// All promises now have an optional cancel function
Promise.prototype.cancel = () => { };

export class TwitterAnalyticsDashboard extends Component {
  static displayName = TwitterAnalyticsDashboard.name;

  constructor(props) {
    super(props);
    this.state = { tpm: 0, streamData: "", msgCount: 0, currentMessages: 0, maxMessages: 3, loading: true, connection: null, tweetsThisMinute: 0 };
  }

  getStream = () => {
    const cancelRequest = new AbortController();
    const signal = cancelRequest.signal;
    //const response = fetch('streamanalyzer');
    const promise = new Promise(async (resolve) => {

      try {
        const response = await fetch('streamanalyzer', {
          method: "get",
          signal,
        });
        
      } catch (error) {
        console.log(`Caught rejected promise. ${error}`)
      }
    });
    promise.cancel = () => cancelRequest.abort();
    return promise;
  };


  // Calculates average tweets per minute (tpm) by adding the previous average to the new batch of tweets
  // and dividing by 2.  Alternatively, we could just divide total tweets since the program started by the
  // amount of minutes elapsed.  There are also different rolling averages that could be calculated by using N
  // intervals, such as a 5-period simple moving average i.e. (T1 + T2 + T3 + T4 + T5) / 5 where T(n) is
  // the amount of tweets generated at interval n.
  calcTpm = () => {
    this.setState((prevState) => {
      // If average tweets per minute is zero, then record tpm as as however many tweets were captured 
      // in the current interval
      if (this.state.tpm == 0) {
        return { tpm: prevState.tweetsThisMinute }
      }
      else {
        // otherwise take the average of the old and the new
        return { tpm: (prevState.tpm + prevState.tweetsThisMinute) / 2 }
      }
    });
    // reset the counter for the next interval
    this.setState({tweetsThisMinute : 0});
  }

  async componentDidMount() {
    
    // Connect to ASP.NET Core backend hub
    const hubConnection = new HubConnectionBuilder().withUrl("/streamHub").build();
    hubConnection.start().then(function () {
        console.log("Hub connection started.")
    }).catch(function (err) {
        return console.error(err.toString());
    });
    
    // Define how we handle incoming messages from the StreamHub
    hubConnection.on('ReceiveMessage', (message) => {
      
      // Manipulate the DOM to show a limited amount of new tweets per update
      this.setState((prevState) => {
        return { currentMessages: prevState.currentMessages + 1 }
      })
      var htmlList = document.getElementById("messagesList");
      if (this.state.currentMessages > this.state.maxMessages) {

        if(htmlList.firstElementChild != null) {
          htmlList.firstElementChild.remove();
        }

        this.setState((prevState) => {
          return { currentMessages: prevState.currentMessages - 1 }
        })
      }

      var li = document.createElement("li");
      htmlList.appendChild(li);
      li.textContent = `${message}`;
      
      // Update the state for our analytics
      this.setState((prevState) => {
        return { loading: false, msgCount: prevState.msgCount + 1, tweetsThisMinute: prevState.tweetsThisMinute + 1 }
      })
    });

    // Begin a recurring callback for calculating tweets per minute
    var tweetsPerMinuteInterval = setInterval(this.calcTpm, 60000);

    // Tell the ASP.NET core service to open the twitter stream for consumption
    let streamPromise = this.getStream();
    //const json = await response.json();
    
    this.setState({ streamRequest: streamPromise, tweetsThisMinute: 0, tpmInterval: tweetsPerMinuteInterval, tpm: 0, streamData : "", loading: true, msgCount : 0, currentMessages: 0, connection : hubConnection });
  }

  componentWillUnmount() {
    console.log('Disconnecting...');
    var connection = this.state.connection;
    
    if (connection != null) {
      connection.stop();
      console.log('Disconnected from SignalR hub.');
    }

    if (this.state.streamRequest != null) {
      this.state.streamRequest.cancel();
      console.log('Stream request cancelled.');
    }

    if (this.state.tpmInterval != null) {
      clearInterval(this.state.tpmInterval);
      console.log('Timer stopped.');
    }
  }

  render() {

    return (
      <div className="App">
        
        <p>Number of tweets: {this.state.msgCount}</p>
        <p>Avg tweets per minute: {this.state.tpm.toString()}</p>
        <p>Tweets in the current interval: {this.state.tweetsThisMinute.toString()}</p>
            <div class="container">
            <div class="row">&nbsp;</div>
        </div>
        <div class="row">
            <div class="col-12">
                <hr />
            </div>
        </div>
        <div class="row">
            <div class="col-10">
                <ul id="messagesList"></ul>
            </div>
        </div>

      </div>
    );

  }
}

