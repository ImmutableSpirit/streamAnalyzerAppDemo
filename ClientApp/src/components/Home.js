import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Welcome</h1>
        <p>This demo application was built with:</p>
        <ul>
          <li><a href='https://dotnet.microsoft.com/apps/aspnet/signalr'>Microsoft SignalR</a> for real time communication between the web api and the react frontend.</li>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
          <li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
          <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
        </ul>
        <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template.</p>
        <div>
        <h5>Instructions</h5>
        <p>Navigate to the stream analyzer demo by clicking "Dashboard" in the nav menu above.  It takes a moment for the connection to become established.</p>

        <p>When the stream is initialized, you will see two counters incrementing.  When a minute has passed, the average counter will update from 0 to the amount of tweets that were recorded in the first minute.  Subsequent interval results will be averaged against the previous average for a 2-period moving average.</p>
        
        <p>Finally, if you open the browser dev tools, you will see additional console information to explain what's happening in the background, particularly when navigating between the Home and Dashboard pages.</p>
        
        <h5>Notes</h5>
        <ul>
          <li><p>In this version, I am doing a lot of I/O which may affect performance. It's rendered as HTML, printed in Console.Log, and also on the server side with Console.WriteLine.</p></li>
          <li><p> Navigating away from Dashboard back to Home triggers the stream to close and all outputs stop.  It also stops the timer.</p></li>
        </ul>
          
        </div>
      </div>
    );
  }
}
