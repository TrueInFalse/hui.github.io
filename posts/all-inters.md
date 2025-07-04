# 面经总览
按照时间顺序梳理了所有面经，只选择了和数开岗位有关的记录，也选择了一些有用的记录。


## 25.4.2 美团一面
- 选择数据开发的原因
- 相较于科班有什么优势
- 项目介绍与项目背景
- 数仓理论、数仓分层
- 星型模型与雪花模型



## 25.4.25 云智一面
- Hive和ClickHouse的对比
- MySQL相关知识（索引、引擎、结构）
- ClickHouse（分区分片、物化视图、MergeTree引擎）
- 讲讲Flink
- 讲讲数据湖
- 知道哪些聚类分析方法
- K-Means属于什么类型的学习
- 说说了解哪些二分类算法
- 数仓分层
- OLAP和OLTP的相关知识
- 为什么要进行分层（DWS、ADS为什么）
- 三种事实表相关知识
- 数据倾斜分析与解决
- 你对大数据的看法


## 25.4.27 字节跳动一面
- 项目相关
- 结构化数据一般是怎么清洗完成的？
- DWD层通常做哪些清洗？
- DWS层的模型通常是怎么设计的？
- 了解维度建模、关系建模吗？
- 正常一个数据仓库的工作流和技术栈有哪些？
- Sqoop主要用在哪个环节？做什么的？
- Hadoop和Spark各自优劣势是什么？
- Spark任务一般怎么优化？
- ClickHouse有哪些索引类型？
- ClickHouse中排序键、分片键怎么设置？
- （SQL笔试题）查询每个用户的首次/末次下单日期及标签
- （HSQL笔试题）


## 25.5.6 滴滴一面
- 自我介绍
- 为什么选择数据开发？
- SQL题目做过没有？（开始手撕，两道题目）
- Spark相关（RDD、核心组件、数据倾斜、优化）
- 你所理解的数据仓库
- 主题的划分依据、主题的概念
- 星型模型和雪花型模型
- 从索引角度出发，优化一个MySQL慢查询


## 25.5.16 阅文一二+HR面
### 一面：
- 为什么选择数据开发
- 介绍Hadoop（基本信息、产生、组件、优势）
- 默认副本机制
- 你对Hive的理解
- 谈谈Spark与MapReduce
- 数仓如何分层、为什么分层、设计思想？
- 如何保证数仓数据的稳定性和规范性（数仓质量）
- ETL流程相关知识
- ClickHouse相关知识
- 逻辑回归相关
### 二面：
- 项目介绍（内容、背景、原因、挑战）
- 对于AI的看法
### HR面：
- 项目介绍
- 选择数据开发的原因


## 25.5.20 拼多多一面
- 项目介绍
- ClickHouse相关（分区分片、物化视图、MergeTree引擎）
- Python题目：构造`float(s:str)`函数，将合适的字符串转化成float类型


## 25.5.30 Flip一二面
### 一面：
- 选择数据开发的原因
- ClickHouse相关（分区分片、物化视图、MergeTree引擎）
- 项目介绍（重点数仓构建）
- ODS层相关、Flume相关、Sqoop相关、DWD进行哪些处理
- 如何理解主题域、如何划分主题域、有哪些主题域
- DWS与ADS层（作用、设计原则、面向什么）
- ETL的理解
- 数据建模相关（星型模型和雪花模型）
- Spark相关知识（RDD、核心组件、Application、job、stage、task如何划分）
- 简述Hive
- 对于Kafka的理解（作用）
- SQL题目：
    - 1： 如何统计每天的去重登录用户数量？
    - 2： 如何计算每天登录用户在未来第1、3、5、7天的留存率？
    - 3： 如何找出连续七天登录的用户清单？
### 二面：
- 思考题：在一个单列数字表中取出第二大的数，用尽可能多的方法
- 解读题：共享一段复杂的 `SQL` 代码，解读其意图和逻辑


## 25.6.6 腾讯一面
- 项目介绍与简单提问（环境配置）
- HDFS架构
- 部署Hive出现的问题
- 如何分析报错日志的，具体看哪些日志，怎么看
- Spark的作用、定位
- Hive on Spark与Spark on Hive
- Linux中查看系统资源使用情况的命令（负载、进程、内存）



## 25.6.14 好未来一面
- 详述数仓分层（每层定位、作用）
- ADS层也能做聚合，为什么还要保留DWS这一层聚合？
- 浅层聚合（DWS）和深层聚合（ADS）的作用分别是什么？
- DWD层会对数据进行哪些操作 
- ClickHouse的分区分片、物化视图
- 事实表有哪些类型、差异和适用场景
- 拉链表、缓慢变化维
- 星型模型和雪花模型
- MapReduce的底层原理
- Hive中的排序方式
- 数据倾斜的常见场景以及如何解决
- 数仓搭建完成后，如何保障数据质量和系统稳定性
- SQL题目：统计每个用户的最高下单金额及其对应订单
- 订单表建全量表好还是建增量表好、原因
- 如果再加一个“退费时间”字段，表结构如何设计更合理


## 25.6.17 九星HR面
- 自我介绍、项目介绍、选择数开的原因
- 项目中遇到的困难
- 大学中印象最深刻的困难
- 喜欢的团队风格


## 25.6.20 云智一面
- 自我介绍
- HDFS的组件、元数据是什么、高可用、热备机制
- MapReduce的底层原理（执行过程）
- Spark中的算子有哪些
- map算子与mapPartitions算子的区别
- Spark中Application、job、stage、task相关
- SparkSQL中的三种JOIN
- Spark调优
- 选择Hive on Spark的原因
- ClickHouse的作用与定位
- 其他的OLAP引擎
- 项目技术选型的考虑
- 项目介绍
- 项目中遇到的棘手的问题
- 如何用Linux命令查看负载
- 如何用Linux命令查看某个端口是否被监听


## 25.6.20 陌陌一面




## 25.6.23 星辰征途一面
- 自我介绍
- Hadoop、Hive、Spark的定位与作用（简单理解）
- 详细追问Spark底层原理（内存磁盘、Shuffle、与MapReduce的关系）
- 数仓分层的原因（追问解耦、指标体系）
- 项目的收获（困难与反思、吸收与总结）
- 大数据环境相关追问（Docker、VMware、云服务器）
- Python手撕（字符压缩与解压缩，例如 AAABBC -> A3B2C，正向和逆向过程）