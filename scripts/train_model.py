#!/usr/bin/env python3
"""
ML Model Training Script
Generates synthetic email dataset and trains Naive Bayes classifier with TF-IDF vectorizer.
Saves trained model and vectorizer to pickle files.
"""

import os
import pickle
import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pandas as pd

# Create directories if they don't exist
backend_dir = Path("backend")
dataset_dir = backend_dir / "dataset"
models_dir = backend_dir / "models"
dataset_dir.mkdir(parents=True, exist_ok=True)
models_dir.mkdir(parents=True, exist_ok=True)

# High-priority emails (urgent, time-sensitive, important)
high_priority_emails = [
    ("URGENT: System Down", "Our production server is down. All users are affected. Need immediate action to restore service."),
    ("Critical Security Alert", "Detected unusual login attempts from multiple countries. Potential breach in progress. Escalate immediately."),
    ("Emergency: Budget Approval Needed", "Board meeting in 2 hours. Need your approval on Q1 budget of $2.5M. Decision deadline."),
    ("ASAP: Client Contract Expiring", "Our largest client contract expires tomorrow. Need to renew or we lose $500K annual revenue."),
    ("Fire: Compliance Violation", "Regulatory audit found critical compliance issue. Fines pending if not addressed within 24 hours."),
    ("Immediate Action Required", "Bank flagged fraudulent transaction on company account. $100K transferred. Need to block transfers."),
    ("STAT: Performance Review Due", "Your performance review is due today for salary decision. Please submit by 5 PM."),
    ("Critical: Data Loss Incident", "Database corruption detected. 48-hour window to recover before data becomes unrecoverable."),
    ("Urgent Meeting Scheduled", "CEO wants emergency all-hands in 30 minutes to discuss acquisition opportunity."),
    ("ALERT: API Key Compromised", "Someone accessed our API credentials. All integrations potentially compromised. Rotate keys now."),
    ("Priority: Insurance Claim", "Insurance claim rejection received. Must appeal within 48 hours or lose coverage."),
    ("Emergency Staffing Need", "Team member hospitalized. Need coverage for critical project. Who can work tonight?"),
    ("Urgent: Tax Filing Deadline", "Business tax return deadline is tomorrow. Accountant needs final numbers by EOD today."),
    ("Critical: Patient Health Alert", "Patient flagged critical condition. Immediate medical intervention required."),
    ("URGENT: Shipping Delay Alert", "Major shipment stuck at customs. Customer deadline is tomorrow. Need emergency solution."),
    ("Immediate: Server Outage", "Web server down for 45 minutes. Revenue impact: $5K per hour. Need emergency fix."),
    ("Critical: Grant Deadline", "Research grant application due in 24 hours. Missing key documents. Need immediate action."),
    ("Urgent: Travel Approval", "Flight leaves in 12 hours for critical client meeting. Need expense approval NOW."),
    ("ASAP: Code Review", "Critical security patch needs review before deployment. Cannot release without approval."),
    ("Emergency: Inventory Crisis", "Medical supplies running critically low. Patient care at risk. Emergency order needed."),
    ("Urgent: Board Decision", "Shareholder vote happening tomorrow. Need board alignment on strategy before then."),
    ("Critical: Software Bug", "Critical bug found in production affecting 10% of users. Hotfix needed immediately."),
    ("STAT: Doctor on Call", "Emergency surgery scheduled. On-call surgeon needed in OR within 30 minutes."),
    ("Immediate: Legal Action", "Opposing council sent cease-and-desist. Legal response due in 24 hours."),
    ("Urgent: Equipment Failure", "Production equipment failed. Factory shutdown imminent. Need emergency technician."),
    ("Critical: Customer Outage", "Enterprise customer experiencing complete service outage. SLA at critical level."),
    ("ASAP: Permit Expiration", "Operating permit expires tomorrow. Renewal submission deadline is today."),
    ("Emergency: Team Emergency", "Team member car accident. Need to cover their critical production responsibilities NOW."),
    ("Urgent: Funding Deadline", "Investment funding opportunity expires tomorrow. Board needs to decide by EOD."),
    ("Critical: Network Breach", "Cybersecurity detected intrusion in network. All systems need immediate investigation."),
    ("Immediate: Wedding Emergency", "Wedding planner canceled 3 days before event. Alternative needed within 48 hours."),
    ("Urgent: Client Escalation", "Customer threatening to leave due to service issues. Need executive intervention today."),
    ("Critical: Deadline Miss", "Project deadline was yesterday. Client furious. Need damage control immediately."),
    ("Emergency: Building Evacuation", "Fire alarm activation. Immediate evacuation required. All personnel report status."),
    ("Urgent: Money Transfer", "Need to wire $500K to secure deal. Wire instructions in email. Approval needed NOW."),
    ("Critical: Compliance Audit", "Auditor announced surprise inspection today. Facilities not ready. Emergency preparation needed."),
    ("ASAP: Medical Test Results", "Critical test results came back abnormal. Doctor needs immediate consultation."),
    ("Emergency: Lost Access", "Accidentally locked out of critical system with no backup access. Need IT emergency restore."),
    ("Urgent: Decision Needed", "Major strategic decision point. Board meeting in 4 hours. Analysis needed ASAP."),
    ("Critical: Product Recall", "Safety issue found. Must recall 10,000 units. Legal and media implications."),
]

# Medium-priority emails (important but not urgent)
medium_priority_emails = [
    ("Quarterly Results Analysis", "Please review the Q4 financial results and prepare summary for next week's meeting."),
    ("Team Meeting Tomorrow", "We have a team sync scheduled for tomorrow at 10 AM. Agenda items welcome."),
    ("Project Status Update", "Can you provide a status update on the website redesign project by Friday?"),
    ("New Policy Implementation", "HR is rolling out new remote work policy next month. Please familiarize yourself."),
    ("Contract Review Needed", "Legal team sent vendor contract for review. Please check and return comments by Wednesday."),
    ("Training Schedule", "Annual compliance training is scheduled for next Tuesday. Please confirm attendance."),
    ("Budget Planning", "We need to finalize the 2025 departmental budget. Request is due by end of next week."),
    ("Performance Metrics", "Review attached dashboard showing team performance metrics for the month."),
    ("System Upgrade Scheduled", "IT will perform system maintenance this weekend. Expect 4-hour downtime."),
    ("Meeting Follow-up", "Following up on our meeting yesterday. Here are the action items assigned to your team."),
    ("Campaign Launch Planning", "Marketing wants to discuss Q2 campaign strategy. Can we meet next week?"),
    ("Documentation Update", "Engineering docs need update for new API endpoints. Can you handle this?"),
    ("Client Feedback Summary", "Compiled customer feedback from this month's surveys. Review and discuss in meeting."),
    ("Office Supplies Request", "Please submit office supply requests for the new quarter by the end of the month."),
    ("Vacation Coverage", "I'll be out next week. Here's the coverage plan for my projects while I'm away."),
    ("Networking Event", "Industry conference coming up in 6 weeks. Interested in attending? Limited budget available."),
    ("Vendor Evaluation", "We're evaluating new software vendors. Your input on tool comparison would be helpful."),
    ("Project Milestone Review", "We've hit the halfway point on the development project. Time for a progress review."),
    ("Customer Success Story", "One of our customers agreed to case study. Would you contribute insights?"),
    ("Code Review Assignment", "PR assigned to you for code review. Please review and provide feedback by tomorrow."),
    ("System Performance Issue", "Database queries running slow on reporting dashboard. Need optimization review."),
    ("Recruitment Update", "We're hiring two new team members. Interviews scheduled for next Thursday."),
    ("Security Update Available", "New security patch released for our framework. Plan implementation for next release."),
    ("Mentorship Program", "Employee mentorship program starting next month. Interested in mentoring junior staff?"),
    ("Research Paper Review", "Found relevant research for our project. Could you review and summarize findings?"),
    ("Marketing Materials Needed", "Need updated company bios and headshots for marketing collateral. Can you provide?"),
    ("Customer Retention Plan", "Discussing strategy to retain at-risk customers. Your ideas would be valuable."),
    ("Tool Migration", "Planning migration from Tool A to Tool B. Your team will be impacted. Info session scheduled."),
    ("Feedback Request", "Could you provide feedback on the product mockups shared in the attached design?"),
    ("Industry News", "Interesting news about market trends in our space. Thought you'd find it relevant."),
    ("Collaboration Opportunity", "Another team wants to collaborate on a cross-functional project. Interest in joining?"),
    ("Data Analysis Request", "Need analysis on user behavior data to inform product decisions. Can you help?"),
    ("Onboarding Feedback", "New team member onboarding completed. Feedback on the process would help us improve."),
    ("Process Improvement", "Proposing new workflow to improve team efficiency. Would appreciate your thoughts."),
    ("Certification Course", "Recommended certification course for professional development. Interested? Budget available."),
    ("Service Level Review", "Reviewing SLAs with service providers. Your input on current service levels needed."),
    ("Expense Report Status", "Your expense report is pending approval. Please check the attachment for required edits."),
]

# Low-priority emails (information, FYI, administrative)
low_priority_emails = [
    ("Weekly Newsletter", "This week's company newsletter is ready. Highlights and upcoming events inside."),
    ("Office Birthday", "Birthday celebration for Tom in the breakroom today at 3 PM. Cake and drinks!"),
    ("Parking Reminder", "Reminder: Parking spot cleaning scheduled for this Saturday morning."),
    ("Updated Employee Directory", "Employee directory has been updated. New contact information available on the intranet."),
    ("IT Tips & Tricks", "This week's IT tip: How to optimize your email folder structure for better productivity."),
    ("Lunch Announcement", "Company lunch catered tomorrow in the main conference room. RSVP appreciated."),
    ("Team Outing", "Planning summer team outing to local restaurant. Sign-up sheet is on the bulletin board."),
    ("Upcoming Holiday", "Reminder: Memorial Day holiday on May 26th. Offices will be closed."),
    ("Software License Renewal", "Annual software license is up for renewal. Current pricing available upon request."),
    ("Gym Membership", "Company gym membership now available at discounted rate. Enrollment open until Friday."),
    ("Meeting Room Reservation", "Meeting rooms now available to book through the new scheduling system."),
    ("Desk Relocation", "Your desk will be relocated next week as part of office reorganization. Details to follow."),
    ("Coffee Machine Maintenance", "Coffee machines will be serviced tomorrow. Expect some disruption in the break room."),
    ("Library Update", "Updated business book collection now available in the company library."),
    ("Suggestion Box", "Company suggestion box is open. Submit your ideas for improving workplace culture."),
    ("Lost & Found", "Lost backpack in the main lobby. Please check the lost and found area."),
    ("Company Social Media", "Follow us on social media for company updates and announcements."),
    ("Feedback Survey", "Quick company satisfaction survey sent out. Takes 5 minutes to complete."),
    ("Commuter Benefits", "Reminder: Commuter benefits enrollment deadline is this Friday."),
    ("Wellness Program", "Free yoga classes available Wednesdays at lunch. No experience necessary."),
    ("Art Gallery", "Local art gallery exhibition featuring employee artwork. Opening reception Saturday evening."),
    ("Plant Donation", "Free office plants available from facilities. First come, first served in the lobby."),
    ("Podcast Recommendation", "Interesting business podcast episode you might enjoy. Link in the message."),
    ("Weekly Stats", "This week's usage statistics for office resources and facilities."),
    ("Building Maintenance", "Minor building maintenance will occur next week. Minimal disruption expected."),
    ("Parking Update", "New electric car charging stations installed in parking lot section D."),
    ("Document Shredding", "Confidential document shredding service available. Schedule your pickup online."),
    ("Office Supplies Catalog", "New office supplies catalog available. Check updated pricing and new products."),
    ("Energy Saving Tips", "Tips for reducing energy consumption at home and in the office."),
    ("Team Photo", "Professional team photo session scheduled. Your attendance helps capture company culture."),
    ("Benefits Guide", "Updated benefits guide published. Review section relevant to your employment status."),
    ("Facility Hours", "Updated office facility hours posted. Check the new hours for weekends and holidays."),
    ("Vendor Anniversary", "Our IT vendor celebrating 20 years in business. Promotional discount available this month."),
    ("Training Opportunity", "Free webinar on industry trends. Optional attendance, link available in portal."),
    ("Spring Cleaning", "Office spring cleaning day scheduled. Volunteers appreciated for organizing files."),
    ("Charitable Giving", "Company matching charitable donations this quarter. Submit your preferred charity."),
    ("Weather Advisory", "Severe weather advisory for the region. Consider leaving early if needed."),
    ("Book Club", "Company book club meeting next month. This month's selection and voting details attached."),
]

# Create dataset
data = []

# Add high-priority emails
for subject, content in high_priority_emails:
    data.append({
        "subject": subject,
        "content": content,
        "priority": "High"
    })

# Add medium-priority emails
for subject, content in medium_priority_emails:
    data.append({
        "subject": subject,
        "content": content,
        "priority": "Medium"
    })

# Add low-priority emails
for subject, content in low_priority_emails:
    data.append({
        "subject": subject,
        "content": content,
        "priority": "Low"
    })

# Create DataFrame and save
df = pd.DataFrame(data)
dataset_path = dataset_dir / "email_dataset.csv"
df.to_csv(dataset_path, index=False)
print(f"✓ Dataset created: {dataset_path}")
print(f"  Total emails: {len(df)}")
print(f"  High priority: {len(df[df['priority'] == 'High'])}")
print(f"  Medium priority: {len(df[df['priority'] == 'Medium'])}")
print(f"  Low priority: {len(df[df['priority'] == 'Low'])}")

# Prepare data for training
X = df["subject"].str.cat(df["content"], sep=" ")
y = df["priority"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train vectorizer and model
vectorizer = TfidfVectorizer(
    max_features=500,
    stop_words="english",
    ngram_range=(1, 2),
    min_df=1,
    max_df=0.9
)

X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Train Naive Bayes model
model = MultinomialNB(alpha=0.1)
model.fit(X_train_vectorized, y_train)

# Evaluate model
y_pred = model.predict(X_test_vectorized)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average="weighted", zero_division=0)
recall = recall_score(y_test, y_pred, average="weighted", zero_division=0)
f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

print(f"\n✓ Model trained successfully")
print(f"  Accuracy: {accuracy:.2%}")
print(f"  Precision: {precision:.2%}")
print(f"  Recall: {recall:.2%}")
print(f"  F1-Score: {f1:.2%}")

# Save model and vectorizer
model_path = models_dir / "priority_model.pkl"
vectorizer_path = models_dir / "vectorizer.pkl"

with open(model_path, "wb") as f:
    pickle.dump(model, f)
    print(f"\n✓ Model saved: {model_path}")

with open(vectorizer_path, "wb") as f:
    pickle.dump(vectorizer, f)
    print(f"✓ Vectorizer saved: {vectorizer_path}")

# Save model metadata
metadata = {
    "accuracy": float(accuracy),
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "model_type": "MultinomialNB",
    "vectorizer_type": "TfidfVectorizer",
    "features": int(vectorizer.max_features),
    "training_samples": len(X_train),
    "test_samples": len(X_test),
}

metadata_path = models_dir / "model_metadata.json"
with open(metadata_path, "w") as f:
    json.dump(metadata, f, indent=2)
    print(f"✓ Metadata saved: {metadata_path}")

print(f"\n✓ Training complete! Model ready for deployment.")
