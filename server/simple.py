#coding:utf-8
import os
import time
import numpy as np
import matplotlib.pyplot as plt

from numba import jit
def ff_1(m):
    return (m==3).sum()/np.logical_and(m>-1,m<5).sum()
def ff_2(m):
    return (m==4).sum()/np.logical_and(m>-1,m<5).sum()
def ff_3(m):
    return (np.logical_or(m==0,m==1)).sum()/np.logical_and(m>-1,m<5).sum()
def ff_4(temp1):
    temp1=temp1.reshape(210,52)
    temp1[temp1==-1]=6
    ymax = 0
    xmin = 28
    xmax = 200
    for jjj in range(0,210):
        for kkk in range(0,52):
            target = temp1[jjj,kkk]
            if target == 6:
                if kkk >= ymax:
                    ymax = kkk
    a=(temp1[xmin:(xmax-xmin),0:ymax]!=6).sum()
    b=(np.logical_or(temp1[xmin:(xmax-xmin),0:ymax]==2,temp1[xmin:(xmax-xmin),0:ymax]==3)).sum()
    return b/a
def ff_5(temp1):
    temp1=temp1.reshape(210,52)
    xmin = 28
    xmax = 200
    ymin = 0
    ymax = 51
    temp2=np.ones_like(temp1)*-1
    for j in range(xmin,xmax):
        for k in range (ymin,ymax):
            target = temp1[j,k]
            target_W = temp1[j-1,k]
            target_NW = temp1[j-1,k+1]
            target_N = temp1[j,k+1]
            target_NE = temp1[j+1,k+1]
            target_E = temp1[j+1,k]
            if target == 6:
                if target_W >= 0 and target_W <= 4:
                    temp2[j-1,k] = temp1[j-1,k]
                if target_NW >= 0 and target_NW <= 4:
                    temp2[j-1,k+1] =temp1[j-1,k+1]
                if target_N >= 0 and target_N <= 4:
                    temp2[j,k+1] = temp1[j,k+1]
                if target_NE >=0 and target_NE <= 4:
                    temp2[j+1,k+1] = temp1[j+1,k+1]
                if target_E >=0 and target_E <= 4:
                    temp2[j+1,k] = temp1[j+1,k]
    ROInum =(temp2!=-1).sum()
    BICnum =(np.logical_or(temp2==2,temp2==3)).sum()
    BIC = BICnum/ROInum
    return BIC
def ff_6(m):
    c1=m.reshape(210,52)[-20:,:]==4
    c2=np.logical_and(m>-1,m<5).reshape(210,52)[-20:,:]
    return c1.sum()/c2.sum()

from sklearn.externals import joblib
clf = joblib.load('nclf.pkl')
def rf_class(x_p,ma):
    ma=np.array(ma)
    x_p=np.array(x_p).reshape(-1,10)
    rfp=clf.predict(x_p[(ma.reshape(-1)==3)])#.argmax(axis=-1)
    rfp[rfp==2]=3
    ma[ma==3]=rfp
    return ma        
def mark(maa):
    maa=maa.reshape(35,10920)
    for j in range(10920):
        if np.any(maa[:,j]==4):
            a2=np.where(maa[:,j]==4)[0][0]
            maa[a2:,j]=4
    return maa
def compare(a1):
        la=[]
        for i in range(35):
            la.append(ff_1(a1[i]))
            la.append(ff_2(a1[i]))
            la.append(ff_3(a1[i]))
            la.append(ff_4(a1[i]))
            la.append(ff_5(a1[i]))
            la.append(ff_6(a1[i]))
        return la


rotk='2'
path2=os.path.abspath('..')
@jit(nopython=True, parallel=True)
def s_classification(s):
    ans=np.zeros(len(s))
    for i in range(len(s)):
        if s[i]<=0.0103 :
            ans[i]=5
        elif s[i]>0.0103 and s[i]<=0.266:
            ans[i]=4
        elif s[i]<=1 and s[i]>0.266:
            ans[i]=3
        elif s[i]<=3 and s[i]>1:
            ans[i]=2
        elif s[i]>3:
            ans[i]=1
    return ans
rotk='1'
y_mean = np.loadtxt(open("n_y_mean%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
y_var = np.loadtxt(open("n_y_var%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
y_scale = np.loadtxt(open("n_y_scale%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
x_mean = np.loadtxt(open("n_x_mean%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
x_var = np.loadtxt(open("n_x_var%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
x_scale = np.loadtxt(open("n_x_scale%s"%(rotk),"rb"),delimiter=" ",skiprows=0)
from tensorflow.keras import backend as K 
def categorical_focal_loss_fixed(y_true, y_pred):
    gamma=2.0
    alpha=0.25
    y_pred /= K.sum(y_pred, axis=-1, keepdims=True)
    epsilon = K.epsilon()
    y_pred = K.clip(y_pred, epsilon, 1. - epsilon)
    cross_entropy = -y_true * K.log(y_pred)
    loss = alpha * K.pow(1 - y_pred, gamma) * cross_entropy
    return K.sum(loss, axis=1)
from tensorflow.keras.models import load_model
model1 = load_model('after_net1.h5')
model2 = load_model('after_net2.h5', custom_objects={'categorical_focal_loss_fixed': categorical_focal_loss_fixed})
model3 = load_model('after_net3.h5')
def re2(inputs):
    return (inputs.reshape(-1,6)/y_scale)*y_var+y_mean
def re1(inputs):
    return (inputs.reshape(-1,4)/x_scale)*x_var+x_mean
def tran1(inputs):
    return (inputs.reshape(-1,4)-x_mean)/x_var*x_scale
def ju(un_x,ss):
    cort=np.logical_and(un_x[:,1]>19900e6,un_x[:,1]<20100e6)
    ti=un_x[:,1]>111000e6
    canc=np.logical_and(ss==0,np.logical_and(np.logical_not(ti),np.logical_not(cort)))
    tissue=np.logical_not((cort+ti+canc))
    return cort,ti,canc,tissue
def gen_map(inputs,con):
    s_p=np.array([[2e6,0.17,1e-14],
     [10e6,0.17,5e-15],
     [1000e6,0.3,1e-14],
     [6000e6,0.3,1e-13],
     [1e6, 0.17,1e-14]])
    tar_p=np.array([[20000e6,0.30,1e-17],
                       [113e9,0.3,0],
                       [6e9,0.3,3.7e-13]])
    mapp=np.zeros([len(inputs),3])
    for j in range(len(inputs)):
        if inputs[j]==-1:
            mapp[j,:]=tar_p[1]
        elif inputs[j]==5:
            mapp[j,:]=tar_p[0]
        elif inputs[j]==6:
            mapp[j,:]=tar_p[2]
        else:
            mapp[j,:]=s_p[int(inputs[j])]*con[j]+s_p[4]*(1-con[j])
    return np.concatenate((con.reshape(-1,1),mapp.reshape(-1,3)),axis=1)
def cnn_part(old_5,con):
    con=re2(con)[:,5]
    nn=gen_map(old_5,con)
    return nn
def iterr_cnn(nextt,tar1,tar2,tar3,tar4):
    inputs=tran1(nextt.reshape(-1,4)).reshape(-1,4*10920)
    pre=model1.predict(inputs).reshape(-1,6)
    pre1=model2.predict(pre.reshape(-1,6))
    pre1=np.hstack((pre1,np.zeros([10920,2])))
    pre1[tar2]=[0,0,0,0,0,0,1]
    pre1[tar1]=[0,0,0,0,0,1,0]
    pre1[tar3]=[0,0,0,0,0,0,1]
    pre2=model3.predict(pre1.reshape(1,10920*7)).argmax(axis=3).reshape(-1,1)
    
    pre2[tar1]=5
    pre2[tar3]=6
    pre2[tar2]=-1
    nn=gen_map(pre2,re2(pre)[:,5])
    return pre2,nn,pre,inputs.reshape(-1,4)
def ave_10(old,new,day):
    if day >=9:
        next_day=0.9*old+0.1*new
    else:
        next_day=(day*old+new)/(day+1)
    return next_day
def creat(imp):
    x_b=np.where(imp==1)[1].max()+5
    y_b=np.where(imp==1)[0][0]-4
    imp[:,x_b:]=2
    imp[:y_b,:]=2
    imp[-20:][:,x_b:]=3
    tar_p=np.array([[0,2e6,0.30,1e-17],
                           [0,113e9,0.3,0],
                           [0,20000e6,0.3,3.7e-13],
                           [0,1e6, 0.17,1e-14]])
    fi=np.zeros([210,52,4])
    fi[imp==0]=tar_p[3]
    fi[imp==1]=tar_p[1]
    fi[imp==2]=tar_p[0]
    fi[imp==3]=tar_p[2]
    ss=np.ones([210,52])
    ss[imp!=0]=0
    return(tran1(fi)),ss
def vis2(log):
    buf = io.BytesIO()
    name=['VFM ','VFR ','VFS ','BA  ','BIC ','MBL ']
    fig,axes=plt.subplots(nrows=1,ncols=1,figsize=(16,8),dpi=100)
    for i in range(6):
        if i==1:
            plt.plot(log[:,i]*1000,label='%s[%.2f] ‰'%(name[i],log[:,i][-1]*1000))
        else:
            plt.plot(log[:,i]*100,label='%s[%.2f] %%'%(name[i],log[:,i][-1]*100))
    plt.legend(fontsize=20)
    plt.xlim([0,50])
    plt.xticks(fontsize=20)
    plt.yticks(fontsize=20)
    plt.xlabel('Day',fontsize=20)
    plt.ylabel('%',fontsize=20)
    plt.savefig(buf, format='png')
    plt.clf()
    return [base64.b64encode(buf.getvalue())],[log[:,3][-1]*1000,log[:,4][-1]*100,log[:,5][-1]*100]

import io
from PIL import Image
import base64

def vis1(pre):
    a=[]
    for i in range(35):
        buf = io.BytesIO()
        fig,axes=plt.subplots(nrows=1,ncols=1,figsize=(5,21),dpi=50)
        from matplotlib import colors
        colorslist = ['k','#FF00FF','#7700FF','#00FF00','#006400','#FFFFFF','#E93EFF','#00FFFF']
        cmaps = colors.LinearSegmentedColormap.from_list('mylist',colorslist,N=8)
        
        plt.xticks([])
        plt.yticks([])
        plt.imshow(np.rot90(pre[i].reshape(210,52),2),cmap=cmaps,vmin=-1,vmax=7, animated=True)
        plt.title('Day %d'%(i),fontsize=52,verticalalignment='baseline',y=-0.07)

        plt.savefig(buf, format='png')
        plt.clf()
        
        a.append(base64.b64encode(buf.getvalue()))
    return a
    #%%
def first(input_x,ss):
    un_x=re1(input_x)
    tar1,tar2,tar3,tar4=ju(un_x,ss.reshape(-1))
    pre=model1.predict(input_x.reshape(1,43680))
    pre1=model2.predict(pre.reshape(-1,6))
    pre1=np.hstack((pre1,np.zeros([10920,2])))
    pre1[tar2]=[0,0,0,0,0,0,1]
    pre1[tar1]=[0,0,0,0,0,1,0]
    pre1[tar3]=[0,0,0,0,0,0,1]
    pre2=model3.predict(pre1.reshape(1,76440)).argmax(axis=3).reshape(-1,1)
    
    pre2[tar1]=5
    pre2[tar3]=6
    pre2[tar2]=-1
    un_ave=cnn_part(pre2,pre)
    next_day=ave_10(un_x,un_ave,0)
    return  tar1,tar2,tar3,tar4,un_x,pre2,next_day,pre

def iter_(next_day,tar1,tar2,tar3,tar4,step1x,step3x):
    day=1
    for i in range(34):
        s_map,un_ave,x_p,x_m=iterr_cnn(next_day,tar1,tar2,tar3,tar4)
        step3x.append(s_map)
        step1x.append(np.hstack((x_m,x_p)))
        next_day=ave_10(next_day,un_ave,day)
        day+=1
    return step1x,step3x    
def fk(input_x,ss):
    step1x=[]
    step3x=[]
    tar1,tar2,tar3,tar4,un_x,s_map,next_day,ffff=first(input_x,ss)
    step1x.append(np.hstack((input_x.reshape(-1,4),ffff.reshape(-1,6))))
    step3x.append(s_map)
    return iter_(next_day,tar1,tar2,tar3,tar4,step1x,step3x)
#%%
def work(p1,p3):
    tar=np.array(p3).reshape(-1,10920)==-1
    ma=rf_class(p1,p3)
    
    ma=mark(ma)
    
    out=np.array(compare(ma)).reshape(-1,6)
    ma[tar]=-1
    return ma,out
def pooling(mat,ksize,method='max',pad=False):
    m, n = mat.shape[:2]
    ky,kx=ksize
    _ceil=lambda x,y: int(np.ceil(x/float(y)))
    if pad:
        ny=_ceil(m,ky)
        nx=_ceil(n,kx)
        size=(ny*ky, nx*kx)+mat.shape[2:]
        mat_pad=np.full(size,np.nan)
        mat_pad[:m,:n,...]=mat
    else:
        ny=m//ky
        nx=n//kx
        mat_pad=mat[:ny*ky, :nx*kx, ...]

    new_shape=(ny,ky,nx,kx)+mat.shape[2:]

    if method=='max':
        result=np.nanmax(mat_pad.reshape(new_shape),axis=(1,3))
    else:
        result=np.nanmean(mat_pad.reshape(new_shape),axis=(1,3))

    return result
def rota(im):
    a=im<120
    return np.rot90(pooling(a*1,(2,2)),2)
    
def ai_part(imp):
    
    input_x,ss=creat(rota(imp[:,:,0]))
    np.savetxt('gg',rota(imp[:,:,0]))
    #print(rota(imp[:,:,0]).shape)
    #plt.imshow(rota(imp[:,:,0]))
    #plt.savefig('gg.png')
    p1,p3=fk(input_x,ss)
    ma,log=work(p1,p3)
    a=vis1(ma)
    b,c=vis2(log)
    return a,b,c

#input is 210*52 array 1 is implant 0 is other 
#output a is 1~35 day  b is log
