using System.Net.Http;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.IO;
using System.Net.WebSockets;
using Microsoft.AspNetCore.SignalR;
using StreamAnalyzerApp.Hubs;
using System.Threading;
using Microsoft.Extensions.Options;
using StreamAnalyzerApp.Models;
using System.Runtime.CompilerServices;

namespace StreamAnalyzerApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class StreamAnalyzerController : ControllerBase
    {
        private static readonly HttpClient client;
        private IHubContext<StreamHub> _hubContext;
        private AppSettings _appSettings;

        static StreamAnalyzerController()
        {
            client = new HttpClient();
        }

        public StreamAnalyzerController(IHubContext<StreamHub> hubContext, IOptions<AppSettings> appSettings)
        {
            _hubContext = hubContext;
            _appSettings = appSettings.Value;
        }

        [HttpGet]
        public async IAsyncEnumerable<string> StreamTweetData ([EnumeratorCancellation]CancellationToken cancellationToken) {

            // Set up request
            var url = "https://api.twitter.com/2/tweets/sample/stream";
            Stream stream = null;

            // Connect to stream
            try	
            {
                // Make request
                var accesstoken = _appSettings.twitterBearerToken;
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accesstoken);

                // Parse response
                stream = await client.GetStreamAsync(url);//.GetAsync(url);
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ",e.Message);
            }

            // Pump stream output to WebSocket as input
            if (stream != null)
            {
                Console.WriteLine("----------------------Response body----------------------");
                using (var rdr = new StreamReader(stream))
                {
                    while (!rdr.EndOfStream && !cancellationToken.IsCancellationRequested) 
                    {
                        var streamData = rdr.ReadLine();
                        await _hubContext.Clients.All.SendAsync("ReceiveMessage", streamData);
                        
                        Console.WriteLine(streamData);
                        yield return streamData;
                        
                    }
                }
                Console.WriteLine("----------------------End Response Body----------------------");
            }

            yield return "Done";
        }

    }
}