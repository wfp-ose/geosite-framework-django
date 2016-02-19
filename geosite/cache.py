from pymemcache.client.base import Client

from django.conf import settings

try:
    import simplejson as json
except ImportError:
    import json


def geosite_serializer(key, value):
    if type(value) == str:
        return value, 1
    return json.dumps(value), 2


def geosite_deserializer(key, value, flags):
    if flags == 1:
        return value
    if flags == 2:
        return json.loads(value)
    raise Exception("Unknown serialization format")


def provision_memcached_client():
    print settings.GEOSITE_MEMCACHED_HOST, settings.GEOSITE_MEMCACHED_PORT
    client = Client(
        (settings.GEOSITE_MEMCACHED_HOST, settings.GEOSITE_MEMCACHED_PORT),
        serializer=geosite_serializer,
        deserializer=geosite_deserializer)
    print client
    return client
