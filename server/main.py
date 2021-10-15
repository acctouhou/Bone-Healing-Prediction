from http.server import HTTPServer, BaseHTTPRequestHandler
from json import dumps
import json
import base64
from simple import ai_part
from imageio import imread
import io
import cv2

data = {"result": [
        "https://i.imgur.com/afqrbac.jpg",
        "https://i.imgur.com/q0zbcDQ.jpg",
        "https://i.imgur.com/CGCbFX2.jpg",
        "https://i.imgur.com/wNu5O2N.jpg",
        "https://i.imgur.com/KIwb7DO.jpg",
        "https://i.imgur.com/b0lRvun.jpg",
        "https://i.imgur.com/8zl20Ao.jpg",
        "https://i.imgur.com/STB1MRz.jpg",
        "https://i.imgur.com/8273tOh.jpg",
        "https://i.imgur.com/lVWWmoL.jpg",
        "https://i.imgur.com/i4voq2a.jpg",
        "https://i.imgur.com/FoEQGla.jpg",
        "https://i.imgur.com/W6eShHT.jpg",
        "https://i.imgur.com/9xQQX1C.jpg",
        "https://i.imgur.com/r074SWd.jpg",
        "https://i.imgur.com/A8Qyvts.jpg",
        "https://i.imgur.com/m76S2Hc.jpg",
        "https://i.imgur.com/SDSY2ac.jpg"
        ]}
host = ('127.0.0.1', 8888)


class RequestHandler(BaseHTTPRequestHandler):

    def _send_cors_headers(self):
        """ Sets headers required for CORS """
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers",
                         "x-api-key,Content-Type")

    def send_dict_response(self, d):
        """ Sends a dictionary (JSON) back to the client """
        self.wfile.write(bytes(dumps(d), "utf8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

        response = {}
        response["status"] = "OK"
        response["data"] = data

        self.send_dict_response(response)

    def do_POST(self):
        self.send_response(200)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        dataLength = int(self.headers["Content-Length"])
        post_data = self.rfile.read(dataLength)

        post_data = json.loads(post_data)

        temp = post_data["Kumiko"].replace('data:image/jpeg;base64,', '')

        filename = 'image.jpg'  # I assume you have a way of picking unique filenames
        

        imgdata = imread(io.BytesIO(base64.b64decode(temp)))
        
        print(imgdata.shape)

        resp, log, static = ai_part(imgdata)
        newresp = []
        newstatic = []
        #cv2.imshow('kumiko', imgdata)
        #cv2.waitKey(0)
        #cv2.destroyAllWindows()
        print(type(resp[0]))

        for pics in resp:
            
            newresp.append(pics.decode("utf-8"))

        print(type(static))
        print(static)
        
        
        response = {}
        response["status"] = "OK"
        response["data"] = newresp
        response["log"] = log[0].decode("utf-8")
        response["static"] = static
        self.send_dict_response(response)

        print("done")        


print("Starting server")
httpd = HTTPServer(host, RequestHandler)
print("Hosting server on port 8888")
httpd.serve_forever()
