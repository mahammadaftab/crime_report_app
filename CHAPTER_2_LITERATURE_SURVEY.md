# Chapter 2: Literature Survey

## 2.1 Introduction to Literature Review

![Literature Review Overview](./screenshots/literature_review.png)
*Figure 2.1: Literature Survey Process*

The development of modern crime and accident reporting systems has evolved significantly with advances in technology, particularly in the domains of web development, artificial intelligence, and geospatial mapping. A comprehensive literature review reveals that contemporary research focuses on enhancing user privacy, improving response times, and leveraging advanced analytics for better incident management.

The literature survey encompasses various aspects of digital crime reporting platforms, including anonymous reporting mechanisms, AI-powered analysis, location-based services, and user engagement strategies. This review provides a foundation for understanding the current state of the art in crime reporting systems and identifies gaps that the proposed "Accident and Crime Report App" aims to address.

The review examines existing systems, their technological foundations, and their effectiveness in addressing community safety concerns. By analyzing peer-reviewed research, technical publications, and case studies, this survey establishes the context for the proposed solution and demonstrates its novelty and contribution to the field.

## 2.2 Review of Existing Systems

### 2.2.1 Traditional Crime Reporting Platforms

Traditional crime reporting systems have primarily relied on telephone hotlines, physical reporting at police stations, and basic web forms. According to Wiredu et al. (2024), these systems suffer from significant limitations including limited accessibility, lack of anonymity, and inefficient data management. The study emphasizes the importance of effective crime reporting mechanisms for law enforcement and community safety, highlighting the need for improved accessibility and user experience.

![Traditional Systems](./screenshots/traditional_systems.png)
*Figure 2.2: Conventional Crime Reporting Methods*

### 2.2.2 Decision Support Systems for Crime Analysis

Research by Al-Sabbagh et al. (2014) presents a decision support system (DSS) that integrates natural language processing (NLP), similarity measures, and machine learning techniques, specifically a Naïve Bayes classifier, to automatically analyze and classify crime reports. The DSS achieved an accuracy of 87% in initial evaluations and 94.82% in larger dataset evaluations, demonstrating the potential of automated analysis to improve the handling of anonymous reports.

### 2.2.3 Anonymous Reporting Systems

The Say Something Anonymous Reporting System (SS-ARS) was evaluated by researchers from the University of Michigan, funded by the U.S. Department of Justice (2023). The study found that anonymous reporting systems can enhance school safety and connectedness, with the program positively influencing students' self-efficacy in identifying and reporting warning signs. However, successful implementation requires addressing specific barriers and ensuring proper implementation fidelity.

![Anonymous Reporting](./screenshots/anonymous_reporting.png)
*Figure 2.3: Anonymous Reporting Mechanisms*

### 2.2.4 Online Crime Reporting Portals

Research conducted by scholars from Portland State University and the Portland Police Bureau (n.d.) surveyed 1,198 property crime victims who utilized an online reporting portal. Key findings revealed that 12.5% of respondents found the online system difficult to use, and only 16.7% expressed satisfaction with how their reports were handled. The research highlights that while police departments aim to enhance efficiency through technology, the lack of direct interaction with officers may undermine perceptions of procedural justice.

### 2.2.5 Alternative Reporting Mechanisms

A study on alternative and anonymous reporting systems for sexual assault in Australia (2025) examined platforms that allow victims to report incidents without initiating formal investigations. The research indicates strong support from victim-survivors for these options, as they provide a sense of control and safety in documenting their experiences. However, there is a notable lack of transparency regarding police responses to these anonymous reports, raising concerns about their effectiveness in addressing sexual offences.

![Alternative Reporting](./screenshots/alternative_reporting.png)
*Figure 2.4: Alternative Reporting Platforms*

### 2.2.6 AI Applications in Crime Prediction and Analysis

A systematic literature review by Ahmed et al. (2022) explored various AI strategies and methodologies used to analyze and predict crime rates. The study evaluated 120 research papers published from 2008 to 2021, identifying 34 crime categories and 23 distinct crime analysis methodologies. The review highlights the prevalence of supervised learning techniques and discusses performance metrics, evaluation tools, and the strengths and weaknesses of different AI approaches in crime prediction.

### 2.2.7 AI in Forensic Image Analysis

Research on AI as a decision support tool in forensic image analysis (2025) explores the integration of large language models like ChatGPT-4, Claude, and Gemini into crime scene investigation workflows. The study assesses their effectiveness in analyzing forensic images, with a focus on their potential to assist human experts. Findings indicate that AI can serve as a rapid initial screening tool, enhancing the efficiency of forensic analysis, particularly in complex cases with multiple evidence points.

![AI in Forensics](./screenshots/ai_forensics.png)
*Figure 2.5: AI Applications in Forensic Analysis*

### 2.2.8 Predictive Policing and Explainable AI

A survey by Corasaniti et al. (2024) on artificial intelligence in crime prediction emphasizes the transformative role of AI in enhancing predictive policing by identifying patterns and anticipating criminal activities. The study focuses on the importance of explainable AI (XAI) in building trust and transparency in AI systems, which is crucial for social acceptance. The review highlights that while AI can improve crime prediction accuracy, the integration of XAI remains underdeveloped.

## 2.3 Summary Table of Survey

| Reference | System/Technology | Key Features | Advantages | Limitations |
|----------|-------------------|--------------|------------|-------------|
| Wiredu et al. (2024) | Online Crime Report System | Multi-language interface, anonymous reporting | Improved usability and accessibility | May not address all user needs |
| Al-Sabbagh et al. (2014) | Decision Support System | NLP, ML classification, automated analysis | 94.82% accuracy in crime classification | Requires expert validation |
| University of Michigan (2023) | Say Something ARS | Anonymous reporting for schools | Enhances student self-efficacy | Implementation fidelity varies |
| Portland State University (n.d.) | Online Reporting Portal | Web-based crime reporting | Increased efficiency for police | Low user satisfaction (16.7%) |
| Springer (2025) | Alternative Reporting Systems | Non-investigative reporting | Victim control and safety | Lack of police transparency |
| Ahmed et al. (2022) | AI Crime Prediction | Supervised learning, 34 crime categories | Enhanced predictive capabilities | XAI integration lacking |
| PMC (2025) | AI Forensic Analysis | Large language models, image analysis | Rapid screening tool | Struggles with evidence identification |
| Corasaniti et al. (2024) | Predictive Policing AI | Pattern recognition, crime anticipation | Improved crime prevention | Explainability underdeveloped |

![Survey Summary](./screenshots/survey_summary.png)
*Figure 2.6: Literature Survey Summary Table*

### Technology Integration in Modern Crime Reporting Systems

Contemporary crime reporting applications increasingly integrate advanced technologies to enhance functionality and user experience:

1. **Web Frameworks**: Modern applications like the proposed "Accident and Crime Report App" utilize frameworks such as Next.js 14+ to provide robust frontend experiences with server-side rendering and static site generation capabilities.

2. **AI and Machine Learning**: Integration of AI technologies, including Google's Gemini AI for image analysis, enables automatic categorization and contextual information extraction from submitted incident images.

3. **Geospatial Services**: Platforms like Mapbox provide precise location tracking and mapping capabilities, allowing for accurate incident mapping and response coordination.

4. **Database Management**: Modern ORM solutions like Prisma with PostgreSQL databases ensure reliable data storage and efficient querying capabilities.

5. **Authentication Systems**: Secure authentication mechanisms with email verification and role-based access control protect user privacy while maintaining system integrity.

### Gap Analysis

While existing literature provides valuable insights into crime reporting systems, several gaps remain:

1. **Comprehensive Anonymous Reporting**: Few systems combine complete anonymity with effective follow-up mechanisms and community engagement features.

2. **Integrated AI Analysis**: Limited research addresses the combination of image analysis, natural language processing, and automatic emergency detection in a single platform.

3. **User Incentivization**: Most existing systems lack robust reward mechanisms to encourage continuous community participation in public safety initiatives.

4. **Performance Optimization**: Few studies examine the implementation of modern web performance optimizations such as code splitting, dynamic imports, and API caching in crime reporting applications.

5. **Real-time Emergency Response**: Limited research focuses on automatic emergency service notifications based on AI analysis of incident reports.

The proposed "Accident and Crime Report App" addresses these gaps by integrating advanced web technologies, AI-powered analysis, location-based services, and community incentivization mechanisms into a unified platform that prioritizes user privacy while enhancing law enforcement capabilities.

![Gap Analysis](./screenshots/gap_analysis.png)
*Figure 2.7: Identified Research Gaps*