with open("desktop.csv", 'r') as f:
    lines = f.readlines()
    keys = []
    for d in lines[3].split(','):
        d = d[:d.index('(')]
        
        res = ""
        for word in d[:-1].split(" "):
            word = word[0].upper() + word[1:]
            res += word
        


        keys.append(res)

    data = {k:[] for k in keys}


    for l in lines[4: ]:
        l = l[:-1].split(",")
        for i, d in enumerate(l):
            try:
                data[keys[i]].append(float(d)) 
            except:
                data[keys[i]].append(-1) 

    print(keys)
    #print(data['VerticalVelocity'])
    print(data['Thrust'])
