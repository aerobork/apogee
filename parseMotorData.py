string = """<eng-data cg="35." f="0." m="21.5" t="0."/>
<eng-data cg="35." f="10.866" m="21.3536" t="0.047"/>
<eng-data cg="35." f="11.693" m="20.8362" t="0.127"/>
<eng-data cg="35." f="11.9" m="20.41" t="0.19"/>
<eng-data cg="35." f="11.622" m="19.5603" t="0.316"/>
<eng-data cg="35." f="10.593" m="18.2483" t="0.522"/>
<eng-data cg="35." f="9.287" m="16.9887" t="0.743"/>
<eng-data cg="35." f="7.842" m="15.7463" t="0.996"/>
<eng-data cg="35." f="6.19" m="14.7284" t="1.249"/>
<eng-data cg="35." f="5.296" m="14.0007" t="1.47"/>
<eng-data cg="35." f="4.747" m="13.0879" t="1.787"/>
<eng-data cg="35." f="4.471" m="11.5419" t="2.372"/>
<eng-data cg="35." f="4.403" m="9.8933" t="3.02"/>
<eng-data cg="35." f="4.264" m="8.08683" t="3.747"/>
<eng-data cg="35." f="4.403" m="6.24061" t="4.49"/>
<eng-data cg="35." f="4.333" m="4.02404" t="5.375"/>
<eng-data cg="35." f="4.264" m="2.26914" t="6.087"/>
<eng-data cg="35." f="4.264" m="0.723924" t="6.719"/>
<eng-data cg="35." f="4.196" m="0.3407" t="6.877"/>
<eng-data cg="35." f="3.783" m="0.157694" t="6.957"/>
<eng-data cg="35." f="2.614" m="0.0714955" t="7.004"/>
<eng-data cg="35." f="1.513" m="0.0336329" t="7.036"/>
<eng-data cg="35." f="0.55" m="0.00583432" t="7.083"/>
<eng-data cg="35." f="0." m="0." t="7.12"/>"""

def parseMotor(string):
    lines = string.split('\n')
    data = []
    for l in lines:
        idx = l.index("f=\"")
        l = l[idx + 3:]
        end = l.index('\"')
        force = float(l[:end])

        idx = l.index("t=\"")
        l = l[idx + 3:]
        end = l.index('\"')
        time = float(l[:end])
        
        #print(time, force)
        data.append([time, force])

    return data

print(parseMotor(string))