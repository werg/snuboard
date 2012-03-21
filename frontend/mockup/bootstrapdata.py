import requests, bs4, json

url = "http://www.reddit.com"
result = []
cycle = 1

def or0(obj, attr=None):
    if obj:
        return obj.attrs[attr].encode('ascii', 'ignore') if attr else obj.text.encode('ascii', 'ignore')
    else:
        return None
while (url and len(result) < 1500):
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.text)
    things = soup.find_all('div', attrs={"class":"thing"})
    for thing in things[1:]:
        thumb = thing.find('a', attrs={'class':'thumbnail'})
        item = {
            'time':      or0(thing.find('time')),
            'thumbnail': or0(thumb.find('img'), 'src') if thumb else None,
            'title':     or0(thing.find('a', attrs={'class':'title'})),
            'tag':       or0(thing.find('a', attrs={'class':'subreddit'})),
            'url':       or0(thing.find('a', attrs={'class':'title'}), 'href'),
            'author':    or0(thing.find('a', attrs={'class':'author'}))
        }
        if item['title']:
            result.append(item)

    url = soup.find('p', attrs={'class': 'nextprev'}).find('a').attrs['href'];
    print cycle, " - ", len(result), "valid items."

f = open('content', 'w')
json.dump(result, f)
f.close()