from django.conf import settings

from geosite.enumerations import MONTHS_NUM, MONTHS_LONG, MONTHS_SHORT3, MONTHS_ALL, DAYSOFTHEWEEK

def geosite(request):
    """Global values to pass to templates"""

    ctx = {
        "MONTHS_NUM": MONTHS_NUM,
        "MONTHS_SHORT3": MONTHS_SHORT3,
        "MONTHS_LONG": MONTHS_LONG,
        "MONTHS_ALL": MONTHS_ALL,
        "DAYSOFTHEWEEK": DAYSOFTHEWEEK,
        "GEOSITE_STATIC_VERSION": settings.GEOSITE_STATIC_VERSION,
        "GEOSITE_STATIC_DEBUG": settings.GEOSITE_STATIC_DEBUG,
        "GEOSITE_STATIC_DEPS": settings.GEOSITE_STATIC_DEPS,
        "GEOSITE_DNS_PREFETCH": settings.GEOSITE_DNS_PREFETCH
    }

    print "Geosite CTX: ", ctx

    return ctx
