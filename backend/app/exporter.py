import os
import io
from typing import Dict, Any
from .gap_engine import GapAnalysisResult
from .quality_engine import QualityMetrics

def generate_pdf_report(analysis: GapAnalysisResult, metrics: QualityMetrics) -> bytes:
    """Generates a PDF Gap Analysis Report using ReportLab or fallback HTML-based generator"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#1E293B'),
            bold=True
        )

        h2_style = ParagraphStyle(
            'ReportH2',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#0F172A'),
            spaceBefore=12,
            spaceAfter=6,
            bold=True
        )

        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['BodyText'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#334155')
        )

        # Header Title
        story.append(Paragraph("AI Knowledge Gap Analysis Report", title_style))
        story.append(Paragraph(f"<b>Target Document:</b> {analysis.document_name} | <b>Overall Score:</b> {analysis.total_score}/100 ({analysis.overall_status})", body_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))

        # Executive Summary Table
        summary_data = [
            ["Metric", "Value", "Benchmark Rating"],
            ["Knowledge Coverage", f"{analysis.coverage_percentage}%", "Target >= 85%"],
            ["Total Identified Gaps", str(len(analysis.gaps)), "0 Critical / Prerequisite"],
            ["Readability Index", f"{metrics.flesch_kincaid_score} ({metrics.readability_grade})", "Target > 50"],
            ["Gunning Fog Index", str(metrics.gunning_fog_index), "Optimal 10-14"]
        ]
        t = Table(summary_data, colWidths=[180, 180, 180])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0F172A')),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 6)
        ]))
        story.append(t)
        story.append(Spacer(1, 15))

        # Prioritized Fix List
        story.append(Paragraph("Prioritized Actionable Fix List", h2_style))
        gap_table_data = [["Severity", "Gap Type", "Concept", "Section", "Action Required"]]
        for gap in analysis.gaps:
            gap_table_data.append([
                gap.severity,
                gap.gap_type.upper(),
                gap.concept_name,
                gap.section_title,
                gap.recommendation
            ])

        t_gaps = Table(gap_table_data, colWidths=[60, 80, 100, 100, 200])
        t_gaps.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        story.append(t_gaps)

        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    except Exception as e:
        # Fallback text buffer output
        out = f"AI Knowledge Gap Report\nDocument: {analysis.document_name}\nScore: {analysis.total_score}/100\n\nGaps:\n"
        for g in analysis.gaps:
            out += f"- [{g.severity}] {g.concept_name} in {g.section_title}: {g.recommendation}\n"
        return out.encode('utf-8')
