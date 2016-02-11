#!/usr/bin/env python

from setuptools import setup

setup(
    name='geosite-framework-django',
    version='1.0.0',
    install_requires=[],
    author='Patrick Dufour',
    author_email='pjdufour.dev@gmail.com',
    license='BSD License',
    url='https://github.com/wfp-ose/geosite-framework-django',
    keywords='python gis geosite',
    description='Geosite Framework, Django, Version 2.x',
    long_description=open('README.rst').read(),
    download_url="https://github.com/wfp-ose/geosite-framework-django/zipball/master",
    packages=[
        "sparc2",
        "sparc2.tests"],
    classifiers = [
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ]
)
