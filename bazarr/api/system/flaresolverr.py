# coding=utf-8

import requests

from flask_restx import Resource, Namespace, reqparse

from ..utils import authenticate

api_ns_system_flaresolverr = Namespace('System FlareSolverr', description='Test FlareSolverr connectivity')


@api_ns_system_flaresolverr.hide
@api_ns_system_flaresolverr.route('system/flaresolverr')
class FlareSolverr(Resource):
    get_request_parser = reqparse.RequestParser()
    get_request_parser.add_argument('url', type=str, required=True, help='FlareSolverr base URL')

    @authenticate
    @api_ns_system_flaresolverr.doc(parser=get_request_parser)
    @api_ns_system_flaresolverr.response(200, 'Success')
    @api_ns_system_flaresolverr.response(400, 'FlareSolverr unreachable or returned an error')
    @api_ns_system_flaresolverr.response(401, 'Not Authenticated')
    def get(self):
        """Check FlareSolverr health and return its version"""
        args = self.get_request_parser.parse_args()
        url = args.get("url", "").rstrip("/")
        try:
            resp = requests.get("{}/".format(url), timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            return {"status": False, "error": str(e)}, 400
        return {"status": True, "version": data.get("version", "unknown"),
                "message": data.get("msg", "")}, 200
