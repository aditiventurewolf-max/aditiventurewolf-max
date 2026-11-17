import pathlib
S=pathlib.Path(__file__).parent
rd=lambda n:(S/n).read_text()
def page(body,title,desc,sup,nav1,nav3,nav3l,wn,pn,pid,tn):
    h=rd('head.html')
    for k,v in dict(title=title,desc=desc,sup=sup,nav1=nav1,nav3=nav3,nav3l=nav3l).items():h=h.replace('{{'+k+'}}',v)
    b=rd(body).replace('{{drawing}}',rd('drawing.html')).replace('{{manifesto}}',rd('manifesto.html').replace('{{wn}}',wn))
    b=b.replace('{{triage}}',rd('triage.html').replace('{{n}}',tn)).replace('{{pipeline}}',rd('pipeline.html').replace('{{n}}',pn).replace('{{id}}',pid))
    return h+b+rd('footer.html')
out=S.parent
(out/'a-os-first.html').write_text(page('a.html','Unobvious · Intelligence that stays out of your way','Unobvious OS: a calm, voice-first chief of staff. A studio by Avaia Innovations, Bengaluru.','OS','Unobvious OS','beyond','Beyond','02','04','architecture','03'))
(out/'b-lab-first.html').write_text(page('b.html','Unobvious · Systems that make life simpler, not busier','An independent studio in Bengaluru building products, systems and institutions around the person using them.','Studio','Unobvious OS','catalogue','Index','02','05','architecture','04'))
